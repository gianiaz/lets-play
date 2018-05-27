import * as React from "react";

import {AppBar, IconButton, Toolbar, Typography} from "material-ui";
import {Menu as MenuIcon} from "material-ui-icons";
import {Link} from "react-router-dom";
import {AuthenticationBadge} from "./AuthenticationBadge";

export interface TopBarProps {
	authenticated: boolean;
	onLogout: () => any;
	onMenuOpen: () => any;
}

export class TopBar extends React.PureComponent<TopBarProps, {}> {
	public render(): JSX.Element {
		return (
			<AppBar position="static" color="default">
				<Toolbar>
					{this.renderMenuIcon()}
					<Typography style={{marginRight: 8, flex: 1}} variant="title" color="inherit">
						<Link to={this.props.authenticated ? "/" : "/login"}>
							Lets Play
						</Link>
					</Typography>
					<AuthenticationBadge authenticated={this.props.authenticated} onLogout={this.props.onLogout}/>
				</Toolbar>
			</AppBar>
		);
	}

	private renderMenuIcon() {
		if (!this.props.authenticated) {
			return null;
		}
		return (
			<IconButton color="inherit" aria-label="Menu" onClick={this.props.onMenuOpen}>
				<MenuIcon/>
			</IconButton>
		);
	}
}
