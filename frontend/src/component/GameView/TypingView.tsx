import * as React from "react";

import Button from "material-ui/Button";
import Grid from "material-ui/Grid";
import {replace} from "typescript-array-utils";
import {shallowMergeDeep} from "typescript-object-utils";
import {Bet, Match, MatchSet} from "../../model/models";
import {MatchRow} from "../MatchRow";
import {MatchList} from "./MatchList";
import {mergeBetsIntoMatches} from "./mergeBetsIntoMatches";

export interface TypingViewProps {
	matchSet: MatchSet;
	bets: Bet[];
	onSave: (bets: Bet[]) => any;
}

export class TypingView extends React.PureComponent<TypingViewProps, State> {

	public constructor(props: TypingViewProps) {
		super(props);
		this.state = {
			bets: props.bets
		};
	}

	public render(): JSX.Element {
		const elements: Match[] = this.props.matchSet ? this.props.matchSet.matches : [];
		const bets: Bet[] = this.state.bets ? this.state.bets : [];

		const matchesToType = elements.filter((m: Match) => {
			return !m.locked;
		});
		const pastMatches = elements.filter((m: Match) => {
			return m.locked;
		});

		const matches = mergeBetsIntoMatches(matchesToType, bets);

		return (
			<div>
				{this.renderMatchesToType(matches)}
				{this.renderPastMatches(pastMatches)}

			</div>
		);
	}

	public componentWillReceiveProps(nextProps: Readonly<TypingViewProps>, nextContext: any): void {
		if (nextProps.bets !== this.props.bets) {
			this.setState({bets: nextProps.bets});
		}
	}

	private renderPastMatches(matches: Match[]) {
		if (matches.length === 0) {
			return null;
		}
		return (
			<MatchList
				matches={matches}
				bets={this.props.bets}
			/>
		);
	}

	private renderMatchesToType(matches: Match[]) {
		if (matches.length === 0) {
			return (<div style={{textAlign: "center", margin: 10}}>Brak meczy do typowania</div>);
		}
		return (
			<div>
				{matches.length > 10 ? this.renderTopButton() : null}
				<Grid container={true} spacing={16} style={{marginTop: 16}}>
					{matches.map(this.renderElement)}
				</Grid>
				<Button
					fullWidth={true}
					color={"primary"}
					variant={"raised"}
					style={{marginTop: 10}}
					onClick={this.save}
				>
					Zapisz
				</Button>
			</div>
		);
	}

	private renderTopButton() {
		return (
			<Button
				fullWidth={true}
				color={"primary"}
				variant={"raised"}
				style={{marginTop: 15}}
				onClick={this.save}
			>
				Zapisz
			</Button>
		);
	}

	private renderElement = (e: Match, index: number) => {
		return (
			<MatchRow
				match={e}
				key={String(index)}
				index={index}
				editDate={false}
				editName={false}
				onChange={this.edit}
			/>
		);
	};

	private edit = (match: Match) => {
		let bets = this.state.bets;
		const betIndex = bets.findIndex((bet: Bet) => {
			return bet.matchId === match.id;
		});
		if (-1 === betIndex) {
			bets = bets.concat([{matchId: match.id, bet: {home: match.home.score, away: match.away.score}}]);
		} else {
			bets = replace(bets, betIndex,
				shallowMergeDeep(bets[betIndex], {
					bet: {
						home: match.home.score,
						away: match.away.score
					}
				})
			);
		}
		this.setState({bets});
	};
	private save = () => {
		const elements: Match[] = this.props.matchSet ? this.props.matchSet.matches : [];
		const bets: Bet[] = this.state.bets ? this.state.bets : [];

		const matchesToType = elements.filter((m: Match) => {
			return !m.locked;
		}).map((m: Match) => {
			return m.id;
		});
		const betsToSave = bets.filter((bet: Bet) => {
			return -1 !== matchesToType.indexOf(bet.matchId);
		});
		this.props.onSave(betsToSave);
	};
}

interface State {
	bets: Bet[];
}
