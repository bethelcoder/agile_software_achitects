const controller = require('../controller/controller');
const project = require('../api/mongoDB/Project');

/**
 * Mocks for:
 * Project Model
 * Session Middleware
 * route testing
 */

jest.mock('../api/mongoDB/Project');

describe ('These are tests for getProjectsByStatus', () =>{
  let req, res;

  beforeEach(() =>{
    req ={
      params: {
        status: 'posted'
      }
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  // Test 1
  it ("Should return projects with the given status", async () => {
    const sampleProject = [
      {title: 'Building a website'}
    ];
    project.find.mockResolvedValue(sampleProject);
    await controller.getProjectsByStatus(req, res);

    expect(project.find).toHaveBeenCalledWith({status: 'posted'});
    expect(res.json).toHaveBeenCalledWith(sampleProject);

  });

  // Test 2
  it ("Errors should be handled smoothly", async () => {
    project.find.mockRejectedValue(new Error('DB error'));
    await controller.getProjectsByStatus(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Failed to get projects'
    });

  });
});