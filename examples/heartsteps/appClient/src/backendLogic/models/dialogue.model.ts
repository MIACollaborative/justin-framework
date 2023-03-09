/*

Dialogue Model Fields
_id: string,
dialogueID: string, --> a unique ID similar to _id that we generate (optional)
utterances: string[] --> the actual clickable options displayed
choices: string[] --> choices is an array w other dialogue obj IDs

invariant: utterances and choices are always the same length
each utterance index corresponds to a matching choice index

example:
if utterance[1] is clicked, the dialogueID at choice[1] will be the next dialogue object rendered
in this case: we display the utterances of the dialogue object with dialogueID == choice[1]

*/
