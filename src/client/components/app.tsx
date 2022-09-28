import React, { useEffect, useState } from 'react';

import Header from './header';
import Button from './button';
import Main from './main';

const App: React.FC<AppProps> = (props) => {
    
    const [disabled, setDisabled] = useState<boolean>(()=>true)
    
    const [counter, setCounter] = useState<number>(0)

    useEffect(() => {
        // This is important, as it makes the app "usable" once it is hydrated
        setDisabled(false)
    }, [])

    const handleIncrement = () => {
        setCounter(counter => counter + 1)
    }
    
    const handleReset = () => {
        setCounter(0)
    }

    return (
        <div>
            <Main>
                <Header title="Hello React" sub="This is an example using React & TypeScript" />
                <p>Current count: {counter}</p>
                <Button
                    onClick={handleIncrement}
                    disabled={disabled}
                    type="primary"
                    text="Increment"
                />
                <span>&nbsp;</span>
                <Button
                    onClick={handleReset}
                    disabled={disabled}
                    type="warning"
                    text="Reset"
                />
            </Main>
        </div>
    );
}

export default App;
