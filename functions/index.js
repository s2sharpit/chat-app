const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { initializeApp } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');

initializeApp();

// Cloud Firestore triggers for Firebase Functions v2
exports.myFunction = onDocumentCreated('chat/{messageId}', async (event) => {
  const snapshot = event.data;
  
  if (!snapshot) {
    console.log('No data associated with the event');
    return;
  }

  const data = snapshot.data();
  
  // Send notification
  await getMessaging().send({
    notification: {
      title: data['username'],
      body: data['text'],
    },
    data: {
      click_action: 'FLUTTER_NOTIFICATION_CLICK',
    },
    topic: 'chat',
    android: {
      priority: 'high',
    },
  });
});