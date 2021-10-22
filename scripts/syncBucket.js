const fs = require('fs');
const yamlCfn = require('yaml-cfn');
const templateYamlPath = '../template.yaml';
const localS3Path = '../s3';
const samBuildPath = '../.aws-sam/build';
const {exec} = require('child_process');

(async () => {
  const loadYamlFile = (filename) => {
    return yamlCfn.yamlParse(fs.readFileSync(filename, 'utf-8'));
  }

  const createDirectory = (createDirectoryPath) => {
    fs.mkdir(`${localS3Path}/${createDirectoryPath}`, {recursive: true}, (err) => {
      if (err) {
        throw err;
      }
      console.log(`created directory ${createDirectoryPath}`);
    });
  }

  const syncDirectory = (createDirectoryPath, resourceName) => {
    const localS3SyncTargetPath = `${localS3Path}/${createDirectoryPath}`;
    const samSyncTargetPath = `${samBuildPath}/${resourceName}`;

    exec(`rsync -a ${samSyncTargetPath}/* ${localS3SyncTargetPath}`,
      (err, stdout, stderr) => {
        if (err) {
          throw err;
        }
      }
    )
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
      collection.push({
        resourceName: key,
        version: templateYamlContents.Parameters[key].Default,
        createDirectoryPath: `${key}/${templateYamlContents.Parameters[key].Default}`
      });
      return collection;
    }, []);

    deployResources.forEach((deployResource) => {
      createDirectory(deployResource.createDirectoryPath);
      syncDirectory(deployResource.createDirectoryPath, deployResource.resourceName);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
