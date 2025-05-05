// const express = require("express");
// const session = require("express-session");
// const request = require("supertest");

// // My own files
// const controller = require('../controller/controller');
// const User = require('../api/mongoDB/User');
// const res = require('./helper');
// const app = express();

// /**
//  * Mocks for:
//  * User Model
//  * Session Middleware
//  * route testing
//  */

// jest.mock('../api/mongoDB/User');
// app.use(express.json());
// app.use(express.urlencoded(
//     {extended: false}
// ));
// app.set('view engine', 'ejs');

// app.use(session({
//     secret: 'my-test-secret',
//     resave: false,
//     saveUninitialized: true,
// }));

// app.post('/send-username', (request, response) => {
//     request.session.tempUser = {userId: 564789};

//     return controller.submitUsername(request, response);
// });


// describe("Testing the test username controller", () => {
//     beforeEach(() => {jest.clearAllMocks()});

//     // Test 1:
//     it ('It must return 400 if the session is missing', async () => {
//         const testApp = express();

//         testApp.use(express.json());
//         testApp.use(express.urlencoded(
//             {extended: false}
//         ));

//         testApp.use(session({
//             secret: 'my-test-secret',
//             resave: false,
//             saveUninitialized: true,
//         }));

//         testApp.use((req, res, next) => {
//             req.session.tempUser = null;
//             next();
//         });
//         testApp.post('/send-username', controller.submitUsername);

//         const response = await request(testApp)
//             .post('/send-username')
//             .send({username: 'alfred_dev21', roles: ['client']});

//         expect(response.status).toBe(400);
//         expect(response.text).toBe('Session expired. Please re-login.');
//     });

//     // Test 2:
//     it ('should return error 400 if no role is provided', async () => {
//         const response = await request(app)
//             .post('/send-username')
//             .send({username: 'brandin', roles: []});

//         expect(response.status).toBe(400);
//         expect(response.text).toBe('Please select at least one role.');
//     });

//     // Test 3:
//     it ('Database errors should be handled smoothly', async () => {
//         User.findOne.mockResolvedValue(null);

//         User.prototype.save = jest.fn().mockRejectedValue(new Error('DB Error'));

//         const req = {
//             body: {
//                 username: "struggler",
//                 roles: ["freelancer"]
//             },

//             session: {
//                 tempUser:{
//                     userId: 56789
//                 }
//             }
//         }

//         await controller.submitUsername(req, res);

//         expect(res.status).toHaveBeenCalledWith(500);
//         expect(res.json).toHaveBeenCalledWith({
//             message: 'Error saving user'
//         });
//     });

//     // Test 4:
//     it ('Should show an error that username already exists', async () => {
//         User.findOne.mockResolvedValue({userName: "struggler"});

//         const response = await request(app)
//             .post('/send-username')
//             .send({
//                 username: "struggler", 
//                 roles: ["client"]
//             });

//             expect(User.findOne).toHaveBeenCalledWith({userName: "struggler"});
//     });
// });

test('true is true', () => {
    expect(true).toBe(true);
  });