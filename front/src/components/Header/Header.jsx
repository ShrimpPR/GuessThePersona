import AccountMenu from './AccountMenu';

import './Header.css';

const HeaderComponent = () => {
	return (
		<header>
			<h1>my app</h1>
			<div id="header-right">
				<AccountMenu />
			</div>
		</header>
	);
};

export default HeaderComponent;