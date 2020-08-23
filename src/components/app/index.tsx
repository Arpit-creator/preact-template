import React from "react";
import "./style.scss";

interface AppProps {
	message: string;
};

const App: React.FC<AppProps> = ({ message }) => {
	return (
		<div className="App">
			{message}
		</div>
	);
};

export default App;
