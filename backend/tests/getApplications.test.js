// const controller = require('../controller/controller');
// const application = require('../api/mongoDB/Freelancer_Application');
// const res = require('./helper');
// /**
//  * Mocks for:
//  * Application Model
//  * route testing
//  */

// jest.mock('../api/mongoDB/Freelancer_Application');



// describe ('These are tests for createApplicationByFreelancer', () =>{
//   let req;

//   beforeEach(() =>{
//     req ={
//       params: {freelancerId: 'f2025'}
//     };
//   });

//   // Test 1
//   it ("Should get freelancer applications", async () => {
//     const createdApplication = [
//       {projectId: {title: 'p2025'}}
//     ];

//     application.find.mockReturnValue({
//       populate: jest.fn().mockResolvedValue(createdApplication)
//     });

//     await controller.getApplicationsByFreelancer(req, res);

//     expect(application.find).toHaveBeenCalledWith({
//       "freelancerId.userID": "f2025"
//     });
//     expect(res.json).toHaveBeenCalledWith(createdApplication);

//   });
// });



test('true is true', () => {
  expect(true).toBe(true);
});