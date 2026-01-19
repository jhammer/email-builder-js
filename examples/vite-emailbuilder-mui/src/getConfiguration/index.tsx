import EMPTY_EMAIL_MESSAGE from './sample/empty-email-message';
import ONE_TIME_PASSCODE from './sample/one-time-passcode';
import ORDER_ECOMMERCE from './sample/order-ecommerce';
import POST_METRICS_REPORT from './sample/post-metrics-report';
import RESERVATION_REMINDER from './sample/reservation-reminder';
import RESET_PASSWORD from './sample/reset-password';
import RESPOND_TO_MESSAGE from './sample/respond-to-message';
import SUBSCRIPTION_RECEIPT from './sample/subscription-receipt';
import WELCOME from './sample/welcome';

export const EMAIL_BUILDER_DATA_ELEMENT_ID = 'email-builder-data';
export const EMAIL_BUILDER_CONFIG_ELEMENT_ID = 'email-builder-config';

type AppConfig = {
  saveUrl: string;
  presignedUrlEndpoint: string | null;
};

const DEFAULT_CONFIG: AppConfig = {
  saveUrl: '/api/placeholder/save',
  presignedUrlEndpoint: null,
};

export function getAppConfig(): AppConfig {
  const scriptElement = document.getElementById(EMAIL_BUILDER_CONFIG_ELEMENT_ID);
  if (!scriptElement) {
    return DEFAULT_CONFIG;
  }

  try {
    const parsed = JSON.parse(scriptElement.textContent || '{}');
    return { ...DEFAULT_CONFIG, ...parsed };
  } catch {
    console.error("Couldn't parse app config from script element.");
    return DEFAULT_CONFIG;
  }
}

function getConfigurationFromScriptElement() {
  const scriptElement = document.getElementById(EMAIL_BUILDER_DATA_ELEMENT_ID);
  if (!scriptElement) {
    return null;
  }

  const content = scriptElement.textContent?.trim();
  if (!content || content === '{}') {
    return null;
  }

  try {
    const parsed = JSON.parse(content);
    if (parsed && typeof parsed === 'object' && 'root' in parsed) {
      return parsed;
    }
  } catch {
    console.error(`Couldn't load configuration from script element.`);
  }

  return null;
}

function getConfigurationFromHash(template: string) {
  if (template.startsWith('#sample/')) {
    const sampleName = template.replace('#sample/', '');
    switch (sampleName) {
      case 'welcome':
        return WELCOME;
      case 'one-time-password':
        return ONE_TIME_PASSCODE;
      case 'order-ecomerce':
        return ORDER_ECOMMERCE;
      case 'post-metrics-report':
        return POST_METRICS_REPORT;
      case 'reservation-reminder':
        return RESERVATION_REMINDER;
      case 'reset-password':
        return RESET_PASSWORD;
      case 'respond-to-message':
        return RESPOND_TO_MESSAGE;
      case 'subscription-receipt':
        return SUBSCRIPTION_RECEIPT;
    }
  }

  if (template.startsWith('#code/')) {
    const encodedString = template.replace('#code/', '');
    const configurationString = decodeURIComponent(atob(encodedString));
    try {
      return JSON.parse(configurationString);
    } catch {
      console.error(`Couldn't load configuration from hash.`);
    }
  }

  return null;
}

export default function getConfiguration(template: string) {
  // First, try to read from script element
  const scriptConfig = getConfigurationFromScriptElement();
  if (scriptConfig) {
    return scriptConfig;
  }

  // Fall back to URL hash
  const hashConfig = getConfigurationFromHash(template);
  if (hashConfig) {
    return hashConfig;
  }

  return EMPTY_EMAIL_MESSAGE;
}
