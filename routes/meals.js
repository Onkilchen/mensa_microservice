const express = require('express')
const router = express.Router()
const mealsOfSpecificDayService = require('../services/mealsOfSpecificDayService')
const generatedMessage = require('../services/generateResponse')

/**
 * @method post This method awaits a "message"-JSON-Object, consisting of an evaluated message and a date,
 * which will be needed to fetch the meals of the openmensa-API for the specific date. It then generates a
 * nicely formatted answer appends it to the message-object and sends it back to the sender.
 * @param req should contain the message-object in the body
 * @param res the response object containing the extended message-object, with the generated answer */
router.post('/', async (req, res, next) => {
    // the message-object itself
    let message = req.body
    // the date, for which we should fetch the meals. Format-ISO: yyyy-mm-dd or dd-mm-yyyy
    let dateOfMessage = message.evaluatedMessage.date
    let dateOfMessageSplitted = dateOfMessage.split('T')
    dateOfMessage = dateOfMessageSplitted[0]
    // the items, after which we should filter the meals. E.g. vegetarian, vegan,...
    let mealFilters = message.evaluatedMessage.filter
    // without a date, we can't fetch any meals
    if (dateOfMessage === undefined || dateOfMessage === '') {
        dateSplitted = new Date().toISOString().split('T')
        dateOfMessage = dateSplitted[0]
    }
    // if mealFilters isn't already a array, we make one out of it
    if (mealFilters === undefined) {
        // console.log("Bin in undefined")
        mealFilters = ['']
    } else if (!Array.isArray(mealFilters)) {
        // if we don't have any filters, we create an empty array
        mealFilters = [mealFilters]
    }
    // fetch the meals and filter them
    let meals = await mealsOfSpecificDayService.filterMeals(
        mealFilters,
        dateOfMessage
    )
    // generate an answer out of the filtered meals
    let answerText = await generatedMessage.generateSpecificDayAnswer(meals)
    // extend the message object, with an answer-attribute containing the response and a
    // history-property, which can be extended by the other services for debugging purposes.
    message.answer = { content: answerText, history: 'MensaService' }
    res.send(message)
})
// export everything
module.exports = router
