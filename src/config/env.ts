const rawEnv = {
  mapboxAccessToken: process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN,
};

for (const [key, value] of Object.entries(rawEnv)) {
  // Checking !value catches both undefined and empty strings ("")
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. Please add it to your .env file and EAS secrets.`,
    );
  }
}

export const env = rawEnv as Record<keyof typeof rawEnv, string>;
