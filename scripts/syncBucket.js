const fs = require('fs');
const yamlCfn = require('yaml-cfn');
const templateYamlPath = '../output.yaml';
const localS3Path = '../s3';
const samBuildPath = '../.aws-sam/build';
const {exec} = require('child_process');
const yargs = require('yargs');

const argv = yargs
  .option('zip', {
    alias: 'z',
    description: 'create zip directory',
    demandOption: true
  })
  .help()
  .argv;

(async () => {
  const loadYamlFile = (filename) => {
    return yamlCfn.yamlParse(fs.readFileSync(filename, 'utf-8'));
  }

  const createDirectory = (createDirectoryPath) => {
    return new Promise((resolve, reject) => {
      fs.mkdir(`${localS3Path}/${createDirectoryPath}`, {recursive: true}, (err) => {
        if (err) {
          return reject(err);
        }
        console.log(`created directory ${createDirectoryPath}`);
        return resolve();
      });
    });
  }

  const syncDirectory = (createDirectoryPath, resourceName) => {
    return new Promise((resolve, reject) => {
      const localS3SyncTargetPath = `${localS3Path}/${createDirectoryPath}`;
      const samSyncTargetPath = `${samBuildPath}/${resourceName}`;

      exec(`rsync -a ${samSyncTargetPath}/* ${localS3SyncTargetPath}`,
        (err, stdout, stderr) => {
          if (err) {
            return reject(err);
          }

          return resolve();
        }
      )
    });
  }

  const createZip = (createDirectoryPath, version) => {
    return new Promise((resolve, reject) => {
      const localS3SyncTargetPath = `${localS3Path}/${createDirectoryPath}`;

      exec(`cd ${localS3SyncTargetPath} && zip -r ../${version}.zip *`,
        (err, stdout, stderr) => {
          if (err) {
            return reject(err);
          }

          return resolve();
        }
      )
    });
  }

  try {
    if (!fs.existsSync(localS3Path)) {
      exec(`mkdir -p ${localS3Path}`,
        (err, stdout, stderr) => {
          if (err) {
            throw err;
          }
        }
      )
    }

    const templateYamlContents = loadYamlFile(templateYamlPath);

    const deployResources = Object.keys(templateYamlContents.Resources).reduce((collection, key) => {
      if (!templateYamlContents.Parameters[key + 'Version']) {
        return collection;
      }

      collection.push({
        resourceName: key,
        version: templateYamlContents.Parameters[key + 'Version'].Default, // parametersは後ろにVersionをつけないとdeployでエラーになる
        createDirectoryPath: `${key}/${templateYamlContents.Parameters[key + 'Version'].Default}`
      });
      return collection;
    }, []);

    for await (const deployResource of deployResources) {
      await createDirectory(deployResource.createDirectoryPath);
      await syncDirectory(deployResource.createDirectoryPath, deployResource.resourceName);

      if (argv.zip) {
        await createZip(deployResource.createDirectoryPath, deployResource.version);
      }
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
