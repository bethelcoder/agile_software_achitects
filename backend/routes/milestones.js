const express = require("express");
const Review = require("../api/mongoDB/Review");
const Task = require("../api/mongoDB/Task");
const router = express.Router();


/**
 * View Tasks for Milestones
 */

router.get('/milestones/:milestoneId/tasks', async(request, response) =>{
    const {milestoneId} = request.params;

    try {
        const fetchedTasks = await Task.find({milestoneId});

        if (fetchedTasks.length === 0){
            return response
                .status(404)
                .json({
                    message: "There are currently no available tasks for this milestone"
                });
        }

        response.json({fetchedTasks});
        
    } catch (error) {
        response
            .status(500)
            .json({
                message: "Error fetching tasks"
            });
    }
});

/**
 * Mark Tasks for Milestones As Completed
 */
router.patch("/tasks/:taskId/complete", async(request, response) => {
    const {taskId} = request.params;

    try {
        const task = await Task.findById(taskId);

        if (!task){
            return response
                .status(404)
                .json({
                    messsage: "Task not found"
                });
        }

        task.status = "Completed";
        await task.save();
        response.json({
            message: "Task marked as complete"
        });
        
    } catch (error) {
        response
            .status(500)
            .json({
                message: "Error marking task as complete"
            });
    }
});


/**
 * Leave a review for completed tasks
 */
router.post("/reviews", async(request, response) =>{
    const {freelancerId, clientId, rating, comment} = request.body;

    try{
        const review = new Review({
            freelancerId,
            clientId,
            rating,
            comment,
            createdAt: new Date()
        });

        await review.save();
        response
            .status(201)
            .json({
                message: "Review submitted successfully",
                review: review
            });

    }catch(error){
        response
            .status(500)
            .json({
                message: "Error Submitting review"
            });
    }
});


module.exports = router;

/**
 * reminder to self
 * 
 * Do not forget to clean up the routes.
 */

