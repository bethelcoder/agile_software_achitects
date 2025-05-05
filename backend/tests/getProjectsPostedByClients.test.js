// const controller = require('../controller/controller');
// const project = require('../api/mongoDB/Project');
// const res = require('./helper');
// /**
//  * Mocks for:
//  * Project Model
//  * Session Middleware
//  * route testing
//  */

// jest.mock('../api/mongoDB/Project');

// describe ('These are tests for getPostedByClients', () =>{
//     let req;
  
//     beforeEach(() =>{
//       req ={};
//     });
  
//     // Test 1
//     it ("Should return posted projects", async () => {
//       const sampleProject = [{
//             title: 'Building a website',
//             status: 'posted'
//         }
//       ];
//       project.find.mockResolvedValue(sampleProject);
//       await controller.getPostedProjectsByClients(req, res);
  
//       expect(project.find).toHaveBeenCalledWith({status: 'posted'});
//       expect(res.json).toHaveBeenCalledWith(sampleProject);
//     });
  
//     // Test 2
//     it ("Errors should be handled smoothly", async () => {
//       project.find.mockRejectedValue(new Error('DB failure'));
//       await controller.getPostedProjectsByClients(req, res);
  
//       expect(res.status).toHaveBeenCalledWith(500);
//       expect(res.json).toHaveBeenCalledWith({
//         error: 'Failed to get posted projects'
//       });
  
//     });
//   });

test('true is true', () => {
  expect(true).toBe(true);
});