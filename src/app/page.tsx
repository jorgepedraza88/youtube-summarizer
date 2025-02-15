import { Form } from './components/Form';
import { Summary } from './components/Summary';
import { Title } from './components/Title';
import { SummaryProvider } from './SummaryContext';

function Home() {
  return (
    <SummaryProvider>
      <div className="px-4 py-10 lg:py-16">
        <Title />
        <Summary />
      </div>
      <div className="fixed bottom-0 z-10 w-full bg-gradient-to-t from-neutral-900 from-80% to-transparent">
        <Form />
      </div>
    </SummaryProvider>
  );
}

export default Home;
