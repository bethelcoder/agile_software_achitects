const express = require("express");
const session = require("express-session");
const request = require("supertest");

// My own files
const controller = require('../controller/controller');
const application = require('../api/mongoDB/Application');
const { populate } = require("../api/mongoDB/User");
const app = express();

/**
 * Mocks for:
 * Application Model
 * Session Middleware
 * route testing
 */

jest.mock('../api/mongoDB/Application');



describe ('These are tests for createApplicationByFreelancer', () =>{
  let req, res;

  beforeEach(() =>{
    req ={
      params: {freelancerId: 'f2025'}
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
  });

  // Test 1
  it ("Should get freelancer applications", async () => {
    const createdApplication = [
      {projectId: {title: 'p2025'}}
    ];

    application.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue(createdApplication)
    });

    await controller.getApplicationsByFreelancer(req, res);

    expect(application.find).toHaveBeenCalledWith({
      "freelancerId.userID": "f2025"
    });
    expect(res.json).toHaveBeenCalledWith(createdApplication);

  });
});