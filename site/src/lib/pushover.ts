// Pushover notification service

export const sendPushoverNotification = async (
  message: string,
  url: string,
  appToken?: string,
  userKey?: string
) => {
  const PUSHOVER_APP_TOKEN = appToken || process.env.PUSHOVER_APP_TOKEN;
  const PUSHOVER_USER_KEY = userKey || process.env.PUSHOVER_USER_KEY;

  if (!PUSHOVER_APP_TOKEN || !PUSHOVER_USER_KEY) {
    console.log('Pushover credentials not configured, skipping notification');
    return;
  }

  try {
    const formData = new URLSearchParams();
    formData.append('token', PUSHOVER_APP_TOKEN);
    formData.append('user', PUSHOVER_USER_KEY);
    formData.append('message', message);
    formData.append('url', url);

    const response = await fetch('https://api.pushover.net/1/messages.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      console.error('Failed to send Pushover notification:', await response.text());
    }

    return response.ok;
  } catch (error) {
    console.error('Error sending Pushover notification:', error);
    return false;
  }
}; 