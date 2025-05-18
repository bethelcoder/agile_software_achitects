const controller = require('../controller/controller');
const application = require('../api/mongoDB/Freelancer_Application');

/**
 * Mocks for:
 * Application Model
 * Session Middleware
 * route testing
 */

jest.mock('../api/mongoDB/Freelancer_Application');



describe ('These are tests for createApplication', () =>{
  let req, res;

  beforeEach(() =>{
    req ={
      body: {
        freelanceId: 'f2025',
        projectId: 'p2025'
      }
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  // Test 1
  it ("Should create a new application", async () => {
    const createdApplication = {
      freelanceId: 'f2025',
      projectId: 'p2025'
    }
    application.create.mockResolvedValue(createdApplication);
    await controller.createApplication(req, res);

    expect(application.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(createdApplication);

  });

  // Test 2
  it ("Creation errors should be handled smoothly", async () => {
    application.create.mockRejectedValue(new Error('Oops'));
    await controller.createApplication(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to create application'
    });

  });
});