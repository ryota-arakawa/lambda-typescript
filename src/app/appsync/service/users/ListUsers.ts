export const ListUsers = async (): Promise<any> => {
  console.log(`execute listUsers`);

  return {
    items: [
      {
        id: "user id xxxx",
        name: "test",
        todos: [
          {
            id: "xxxx",
            content: "content body"
          }
        ]
      }
    ]
  }
}
