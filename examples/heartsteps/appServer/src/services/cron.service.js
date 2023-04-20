const cron = require('node-cron');
const STAFF_NUM = require('../config/staffNums.config');
// const MessageSurveyService = require('./messageSurvey.service');
const { getSurveyParticipants, getParticipant } = require('./user.service');

const scheduleCron = (cronTime) => {
  if (!cron.validate(cronTime)) {
    return;
  }
  cron.schedule(cronTime, () => {
    console.log('ran cron');
  });
};

// schedules survey delivery for ONE participant
const scheduleCronSurvey = async (participant) => {
  const cronTime = participant.surveyTime;
  if (!cron.validate(cronTime)) {
    console.error('ERROR: cronTime is not a valid cron expression');
    return;
  }
  cron.schedule(cronTime, async () => {
    // TODO: move sendIntroMsg into message service
    // TODO: this is copied code message.controller sendIntroMsg
    console.log('--- inside cron.schedule ---');
    const msgBody = MessageSurveyService.getIntroMessageBody();
    const sender = STAFF_NUM;
    const receiver = participant.whatsappNum;
    console.log('cron.schedule receiver: ', receiver);
    await MessageSurveyService.sendIntroMessage(participant.whatsappNum);
    await MessageSurveyService.addMessage(sender, receiver, msgBody);
    console.log(
      `Message from ${sender}, to ${receiver}\nMessage Body: ${msgBody}`
    );
    console.log(
      `cron survey sent for participant ${
        participant.username
      } at ${new Date().toLocaleTimeString()}`
    );
  });

  console.log(`cron scheduled for ${participant.username} at ${cronTime}`);
};

const restartSurveyCronJobs = async () => {
  const participants = await getSurveyParticipants();
  console.log('participants length', participants.length);
  participants.forEach((participant) => {
    scheduleCronSurvey(participant);
  });
};

// schedules survey delivery for ALL participants where cronTime == user.surveyTime
// const scheduleCronSurveyAll = async (cronTime) => {
//   if (!cron.validate(cronTime)) {
//     return;
//   }
//   getSurveyParticipants(cronTime).then((participants) => {
//     participants.forEach((p) => {
//       cron.schedule(cronTime, () => {
//         console.log(`scheduled cron for participant ${p.username} at ${new Date().toLocaleTimeString()}`);
//       });
//     });
//   });
// };

module.exports = {
  scheduleCron,
  scheduleCronSurvey,
  restartSurveyCronJobs
};
