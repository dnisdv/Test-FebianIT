import { useMockData } from './hooks/getMock'
import SimpleSearch from './components/SimpleSearch';

import { Wrapper } from './App.styled'

function App() {
  const data = useMockData();

  return (
    <Wrapper>
      <SimpleSearch data={data} />
    </Wrapper>
  );
}

export default App;
