/*

Dialogue Model Fields
_id: <randomly generated uuid>,
dialogueID: string, --> a unique ID similar to _id that we generate (optional)
utterances: string[] --> the actual clickable options displayed
choices: string[] --> choices is an array w other dialogue obj IDs
msgBody: an optional array of messages to also send to the user along with the options at the bottom of the screen
functionalCalcReq: an optional boolean value that indicates that this dialogue model needs additional calculations done and cannot simply spit out hardcoded string msgBodys in response
functionalGlobalKey: an optional key that relates to a dictionary of global variables responsible for handling certain functional requirements

invariant: utterances and choices are always the same length
each utterance index corresponds to a matching choice index

example:
if utterance[1] is clicked, the dialogueID at choice[1] will be the next dialogue object rendered
in this case: we display the utterances of the dialogue object with dialogueID == choice[1]


SPECIFIC EXAMPLE (aligned with Figma "Weekly Goal Setting" flow)

Step (1)
A dialogue object following this schema would initially look like:
_id: 1 (usually randomly generated uuid but for this example it helps to keep track of the object IDs)
dialogueID: weeklyGoalSetting
utterances: [
  "Let's start",
  "I don't have time right now"
]
choices: [2, 3]
msgBody: ["Hey Yuxuan! How are you this week? It’s time for the weekly goal setting!"]

Step (2)
If we click "Let's start", we are prompted to dialogue object with _id == 2. This object could look something like this:
_id: 2
dialogueID: goalDifficulty
utterances: [
  "checkbox1",
  "checkbox2",
  "checkbox3",
  "checkbox4",
  "checkbox5"
]
choices: [4, 4, 4, 4, 4]
msgBody: ["How do you feel about this week’s goal?"]

Step (3)
Once any checkbox is clicked, we're always directed to dialogue object with _id == 4. This object could look something like this:
_id: 4
dialogueID: confidenceMeasure
utterances: [
  "checkbox1",
  "checkbox2",
  "checkbox3",
  "checkbox4",
  "checkbox5"
]
choices: [5, 5, 5, 5, 5]
msgBody: [
  "Great job this week!",
  "Here is this week's summary",
  "You have walked 35600 steps, finished 3 daily goals this week."
  "It’s okay for not finishing all of them! I would suggest [estimated] steps as your next week’s daily goal."
  "How confident are you that you will reach your goal?"
]
functionalCalcReq: true

You'll notice that the [estimated] value needs to be calculated and there should be a graph that's printed after the second msgBody. 
This could be accomplished by creating a custom trigger for this specific dialogue object such that the msgBody is not the array above that gets returned.
Rather, the trigger activates certain function(s) that is are responsible for returning the series of messages with the [estimated] value filled in from above.

Step (4)
Once a confidence checkbox is clicked, the user is directed to _id == 5. This object would look like:
_id: 5
dialogueID: confidenceMeasure
utterances: [
  "Sounds good",
  "I want to change my daily goal",
]
choices: [6, 7]
msgBody: [
  "You seems not confident in completing the new daily goal. Do you want to change this daily goal?"
]

Step (5)
If a user wants to change their daily goal, dialogue object with _id == 7 is shown below.
_id: 7
dialogueID: dialyGoalChange
utterances: ["FUNCTIONAL_GLOBAL_KEY"]
choices: [8]
msgBody: [
  "No worries! Please adjust steps as the new daily goal."
]
functionalCalcReq: true
functionalGlobalKey: "DAILY_STEP_COUNT_NUMERIC_VALUE"

In cases like these, a hardcoded string global could be used to denote the functional requirement needed. 
For example, FUNCTIONAL_GLOBAL_KEY is the only value in utterances. Whenever this happens, we don't present a set of utterances in the traditional way.
Because functionalCalcReq is true, we should perform a check to run through a limited set of these hardcoded globals.
Once we confirm DAILY_STEP_COUNT_NUMERIC_VALUE is a hardcoded global, we can present the custom frontend code so that a user can enter their desired step count.
Upon clicking confirm steps, they would then be directed to dialogue object with _id == 8.
Another way to do this would be to include a functionalGlobalKey field with an optional key that corresponds to the function meant to handle this situation. 

Step (6)
The user is then redirected to this dialogue object after entering a step count.

_id: 8
dialogueID: confirmStepGoal
utterances: ["Great!"]
choices: [9]
msgBody: [
  "Now your daily goal is [estimated] steps. Awesome! Your weekly goal setting process has ended."
]
functionalCalcReq: true,
functionalGlobalKey: "RETURN_STEP_COUNT"

Here, we do present utterances in the traditional way. The user is allowed to click "Great!"
However, you'll notice that RETURN_STEP_COUNT is a global to denote the functional requirement in question. 
We need to return the user-modified step count from the database and send the step count embedded in the message.
For this special case, we use the global RETURN_STEP_COUNT to tell our trigger to search for a wrapper function specifically for this scenario.
Once the user clicks "Great!" they are directed to dialogue object with _id == 9.

Step (7)
_id: 9
dialogueID: introMsg
utterances: [
  "I want to change my daily goal",
  "I want to make an activity plan"
  ... (all other basic introductory requests to the chatbot)
]
choices: [1, 10, ...]
msgBody: []

You'll notice that msgBody is empty here because we don't send a message to the user along with the utterances. 
We could have not included the field at all because it's an optional field, but for clarity I've included it here.
*/
