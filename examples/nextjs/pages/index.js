import { useEffect } from 'react';
import { easyDebug } from 'easy-debug';

easyDebug.enable({
  telemetry: { enabled: true },
  tea: { packageId: 'my-frontend' },
  ai: { enabled: true },
});

export default function Home() {
  useEffect(() => {
    const fetchData = easyDebug.wrap(async () => {
      throw new Error('Fetch failed');
    }, { context: 'Home Page' });
    fetchData().catch(() => {
      easyDebug.getPlugin('next').clientError(new Error('Client error'));
      console.log('Predictions:', easyDebug.predict());
    });
  }, []);
  return <h1>Hello World</h1>;
}