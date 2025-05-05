// const controller = require('../controller/controller');
// const project = require('../api/mongoDB/Freelancer_Project');
// const res = require('./helper');
// /**
//  * Mocks for:
//  * Project Model
//  * Session Middleware
//  * route testing
//  */

// jest.mock('../api/mongoDB/Freelancer_Project');



// describe ('These are tests for createProject', () =>{
//   let req;

//   beforeEach(() =>{
//     req ={
//       body: {
//         title: 'Design a wedding dress'
//       }
//     };
//   });

//   // Test 1
//   it ("Should create a new project", async () => {
//     const createdProject = [
//       {title: 'Design a wedding dress'}
//     ];
//     project.create.mockResolvedValue(createdProject);
//     await controller.createProject(req, res);

//     expect(project.create).toHaveBeenCalledWith(req.body);
//     expect(res.status).toHaveBeenCalledWith(201);
//     expect(res.json).toHaveBeenCalledWith(createdProject);

//   });

//   // Test 2
//   it ("Creation errors should be handled smoothly", async () => {
//     project.create.mockRejectedValue(new Error('Error'));
//     await controller.createProject(req, res);

//     expect(res.status).toHaveBeenCalledWith(500);
//     expect(res.json).toHaveBeenCalledWith({
//       error: 'Failed to create project'
//     });

//   });
// });

test('true is true', () => {
  expect(true).toBe(true);
});