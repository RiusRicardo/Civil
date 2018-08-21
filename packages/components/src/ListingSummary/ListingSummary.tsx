import * as React from "react";
import { EthAddress } from "@joincivil/core";
import { getLocalDateTimeStrings } from "@joincivil/utils";
import {
  StyledListingSummaryContainer,
  StyledListingSummaryTop,
  StyledListingSummarySection,
  StyledListingSummaryNewsroomName,
  StyledListingSummaryDescription,
  NewsroomIcon,
  MetaRow,
  MetaItemValue,
  MetaItemLabel,
} from "./styledComponents";
import { buttonSizes, InvertedButton } from "../Button";
import { TextCountdownTimer } from "../PhaseCountdown/";
import {
  AmountDepositedLabelText,
  AmountStakedChallengeLabelText,
  ApplicationPhaseEndedLabelText,
  ApprovedLabelText,
  ChallengeEndedLabelText,
  ViewDetailsButtonText,
} from "./textComponents";
import {
  AwaitingApprovalStatusLabel,
  CommitVoteStatusLabel,
  RevealVoteStatusLabel,
  ReadyToCompleteStatusLabel,
  AwaitingDecisionStatusLabel,
  AwaitingAppealChallengeStatusLabel,
} from "../ApplicationPhaseStatusLabels";

export interface ListingSummaryComponentProps {
  listingAddress?: EthAddress;
  name?: string;
  description?: string;
  listingDetailURL?: string;
  isInApplication?: boolean;
  canBeChallenged?: boolean;
  canBeWhitelisted?: boolean;
  inChallengeCommitVotePhase?: boolean;
  inChallengeRevealPhase?: boolean;
  canResolveChallenge?: boolean;
  canResolveAppealChallenge?: boolean;
  isAwaitingAppealJudgement?: boolean;
  isAwaitingAppealChallenge?: boolean;
  isInAppealChallengeCommitPhase?: boolean;
  isInAppealChallengeRevealPhase?: boolean;
  isWhitelisted?: boolean;
  isUnderChallenge?: boolean;
  canListingAppealChallengeBeResolved?: boolean;
  appExpiry?: number;
  commitEndDate?: number;
  revealEndDate?: number;
  whitelistedTimestamp?: number;
  unstakedDeposit?: string;
  challengeStake?: string;
  appealChallengeCommitEndDate?: number;
  appealChallengeRevealEndDate?: number;
}

export class ListingSummaryComponent extends React.Component<ListingSummaryComponentProps> {
  public render(): JSX.Element {
    const maxDescriptionLength = 120;
    let description = this.props.description;
    if (description && description.length > maxDescriptionLength) {
      description = description.substring(0, maxDescriptionLength) + "...";
    }
    return (
      <StyledListingSummaryContainer>
        <StyledListingSummaryTop>
          <NewsroomIcon />
          <div>
            <StyledListingSummaryNewsroomName>{this.props.name}</StyledListingSummaryNewsroomName>

            {this.renderPhaseLabel()}

            {this.renderPhaseCountdownOrTimestamp()}

            <InvertedButton size={buttonSizes.SMALL} to={this.props.listingDetailURL}>
              <ViewDetailsButtonText />
            </InvertedButton>

            {this.renderUnstakedDepositOrChallengeStake()}
          </div>
        </StyledListingSummaryTop>
        <StyledListingSummarySection>
          <StyledListingSummaryDescription>{description}</StyledListingSummaryDescription>
        </StyledListingSummarySection>
      </StyledListingSummaryContainer>
    );
  }

  private renderPhaseLabel = (): JSX.Element | undefined => {
    if (this.props.isInApplication) {
      return <AwaitingApprovalStatusLabel />;
    } else if (this.props.inChallengeCommitVotePhase || this.props.isInAppealChallengeCommitPhase) {
      return <CommitVoteStatusLabel />;
    } else if (this.props.inChallengeRevealPhase || this.props.isInAppealChallengeRevealPhase) {
      return <RevealVoteStatusLabel />;
    } else if (
      this.props.canBeWhitelisted ||
      this.props.canResolveChallenge ||
      this.props.canListingAppealChallengeBeResolved
    ) {
      return <ReadyToCompleteStatusLabel />;
    } else if (this.props.isAwaitingAppealJudgement) {
      return <AwaitingDecisionStatusLabel />;
    } else if (this.props.isAwaitingAppealChallenge) {
      return <AwaitingAppealChallengeStatusLabel />;
    }
    return;
  };

  private renderPhaseCountdown = (): JSX.Element | undefined => {
    let expiry: number | undefined;
    if (this.props.isInApplication) {
      expiry = this.props.appExpiry;
    } else if (this.props.inChallengeCommitVotePhase) {
      expiry = this.props.commitEndDate;
    } else if (this.props.inChallengeRevealPhase) {
      expiry = this.props.revealEndDate;
    }

    const warn = this.props.inChallengeCommitVotePhase || this.props.inChallengeRevealPhase;

    if (expiry) {
      return <TextCountdownTimer endTime={expiry!} warn={warn} />;
    }

    return;
  };

  /**
   * Renders a human-readable timestamp for phases that have no expiry
   */
  private renderTimestamp = (): JSX.Element | undefined => {
    let timestamp: number = 0;
    let LabelTextComponent: React.SFC = () => <></>;

    // Unchallenged application
    if (this.props.canBeWhitelisted && this.props.appExpiry) {
      timestamp = this.props.appExpiry;
      LabelTextComponent = ApplicationPhaseEndedLabelText;
      // Resolve Challenge
    } else if (this.props.canResolveChallenge && this.props.revealEndDate) {
      timestamp = this.props.revealEndDate;
      LabelTextComponent = ChallengeEndedLabelText;
      // Resolve Appeal Challenge
    } else if (this.props.canResolveAppealChallenge && this.props.appealChallengeRevealEndDate) {
      timestamp = this.props.appealChallengeRevealEndDate;
      LabelTextComponent = ChallengeEndedLabelText;
      // Whitelisted and not Under Challenge
    } else if (this.props.isWhitelisted && !this.props.isUnderChallenge && this.props.whitelistedTimestamp) {
      timestamp = this.props.whitelistedTimestamp;
      LabelTextComponent = ApprovedLabelText;
    }

    if (!!timestamp) {
      const timestampStrings: [string, string] = getLocalDateTimeStrings(timestamp);
      return (
        <MetaRow>
          <MetaItemLabel>
            <LabelTextComponent />
          </MetaItemLabel>
          <MetaItemValue>
            {timestampStrings![0]} {timestampStrings![1]}
          </MetaItemValue>
        </MetaRow>
      );
    }

    return;
  };

  private renderPhaseCountdownOrTimestamp = (): JSX.Element | undefined => {
    if (this.props.isInApplication || this.props.inChallengeCommitVotePhase || this.props.inChallengeRevealPhase) {
      return this.renderPhaseCountdown();
    }
    return this.renderTimestamp();
  };

  private renderUnstakedDeposit = (): JSX.Element | undefined => {
    if (this.props.unstakedDeposit || this.props.isWhitelisted) {
      return (
        <MetaRow>
          <MetaItemValue>{this.props.unstakedDeposit}</MetaItemValue>
          <MetaItemLabel>
            <AmountDepositedLabelText />
          </MetaItemLabel>
        </MetaRow>
      );
    }
    return;
  };

  private renderChallengeStake = (): JSX.Element | undefined => {
    if (this.props.challengeStake) {
      return (
        <MetaRow>
          <MetaItemValue>{this.props.challengeStake}</MetaItemValue>
          <MetaItemLabel>
            <AmountStakedChallengeLabelText />
          </MetaItemLabel>
        </MetaRow>
      );
    }
    return;
  };

  private renderUnstakedDepositOrChallengeStake = (): JSX.Element | undefined => {
    if (this.props.isInApplication || this.props.canBeWhitelisted) {
      return this.renderUnstakedDeposit();
    } else if (
      this.props.inChallengeCommitVotePhase ||
      this.props.isInAppealChallengeCommitPhase ||
      this.props.inChallengeRevealPhase ||
      this.props.isInAppealChallengeRevealPhase ||
      this.props.canResolveChallenge ||
      this.props.canListingAppealChallengeBeResolved ||
      this.props.isAwaitingAppealJudgement ||
      this.props.isAwaitingAppealChallenge
    ) {
      return this.renderChallengeStake();
    }

    return;
  };
}
