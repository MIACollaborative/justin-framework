const Dialogue = require('../models/dialogue.model');

// NOTE: these functions need to be tweaked to allow for the edge cases talked about in the example inside dialogue.model.js
// specifically, they need to include "msgBody", "functionalCalcReq", and "functionalGlobalKey" logic

/**
 * uses utterance clicked to return next dialogue object to be rendered
 * @param {any} utteranceClicked
 * @param {any} currDialogueID
 * @returns {Dialogue}
 */
const updateDialogueUtterances = async (req: any, res: any) => {
  // TODO: change any type to something more useful on req & res
  const { utteranceClicked, currDialogueID } = req.body;
  if (!utteranceClicked || !currDialogueID) {
    return res
      .status(400)
      .json({ message: 'Missing required request body parameters.' });
  }

  const oldDialogueObj = await Dialogue.findOne({
    dialogueID: currDialogueID
  }).exec();

  const conflict: boolean =
    !oldDialogueObj || !oldDialogueObj.utterances.includes(utteranceClicked);
  if (conflict) {
    return res.sendStatus(409); // Conflict
  }
  try {
    const idx: number = oldDialogueObj.utterances.indexOf(utteranceClicked);
    const result = await Dialogue.findOne({
      dialogueID: oldDialogueObj.choices[idx]
    });
    // TODO: delete log in production
    console.log(result);

    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { updateDialogueUtterances };
