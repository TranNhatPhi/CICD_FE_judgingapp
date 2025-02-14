// import { createServer, Model } from "miragejs";

// export function makeServer({ environment = "test" } = {}) {
//   const server = createServer({
//     environment,
//     urlPrefix: "https://localhost:3000",

//     models: {
//       user: Model,
//       project: Model,
//       mark: Model,
//       rank: Model,
//     },

//     seeds(server) {
//       server.create("user", { id: 1, username: "judge1", password: "12345" });
//       server.create("user", { id: 2, username: "judge2", password: "12345" });
//       server.create("project", {
//         id: 1,
//         groupName: "Group 1",
//         projectName: "Project 1",
//         supervisor: "Supervisor 1",
//         client: "Client 1",
//         technologies: "Technologies 1",
//         abstract: "Abstract 1",
//         targetAudience: "Target Audience 1",
//         totalMark: 10,
//         rankId: 1,
//       });
//       server.create("mark", {
//         id: 1,
//         project_id: 1,
//         judge_id: 1,
//         criteria_id: 1,
//         mark: 10,
//       });
//       server.create("mark", {
//         id: 2,
//         project_id: 1,
//         judge_id: 2,
//         criteria_id: 1,
//         mark: 10,
//       });
//       server.create("rank", {
//         id: 1,
//         project_id: 1,
//         rank: 1,
//       });
//     },

//     routes() {
//       this.namespace = "";

//       // Login route
//       this.post("/login", (schema, request) => {
//         const attrs = JSON.parse(request.requestBody);
//         const user = schema.users.findBy({
//           username: attrs.username,
//           password: attrs.password,
//         });
//         if (user) {
//           return { token: "fake-jwt-token", user };
//         } else {
//           return new Response(
//             401,
//             { some: "header" },
//             { error: "Invalid credentials" },
//           );
//         }
//       });

//       // Query marks based on project ID
//       this.get("/projects/:id/marks", (schema, request) => {
//         const projectId = request.params.id;
//         const marks = schema.marks.where({ project_id: projectId });
//         return marks;
//       });

//       this.get("/projects", (schema) => {
//         return schema.projects.all();
//       });
//     },
//   });

//   return server;
// }
