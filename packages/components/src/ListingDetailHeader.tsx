import * as React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { CharterData } from "@joincivil/core";
import { colors, fonts } from "./styleConstants";
import { TwitterIcon, FacebookIcon } from "./icons";
import { Button, buttonSizes } from "./Button";
import {
  AwaitingApprovalStatusLabel,
  CommitVoteStatusLabel,
  RevealVoteStatusLabel,
  ReadyToCompleteStatusLabel,
  AwaitingDecisionStatusLabel,
  AwaitingAppealChallengeStatusLabel,
} from "./ApplicationPhaseStatusLabels";

const ListingDetailOuter = styled.div`
  background: ${colors.primary.BLACK};
  display: flex;
  justify-content: center;
`;

const StyledListingDetailHeader = styled.div`
  color: ${colors.basic.WHITE};
  font-family: ${fonts.SANS_SERIF};
  padding: 24px 0 62px;
`;

const ListingDetailNewsroomName = styled.h1`
  font: 200 48px/40px ${fonts.SERIF};
  letter-spacing: -0.19px;
  margin: 0 0 18px;
`;

const ListingDetailNewsroomDek = styled.p`
  font: normal 21px/35px ${fonts.SANS_SERIF};
  margin: 0 0 35px;
`;

const GridRow = styled.div`
  display: flex;
  width: 1200px;
`;
const LeftShark = styled.div`
  width: 695px;
`;
const RightShark = styled.div`
  margin-left: 15px;
  width: 485px;
`;

const StyledRegistryLinkContainer = styled.div`
  padding: 0 0 43px;

  & a {
    color: ${colors.basic.WHITE}B3;
  }
`;

const NewsroomLinks = styled.div`
  display: flex;
  margin-top: 40px;
`;
const VisitNewsroomButtonWrap = styled.div`
  line-height: 32px;
  width: 50%;
`;
const FollowNewsroom = styled.div`
  display: inline-block;
  width: 50%;
`;
const FollowNewsroomHeading = styled.h5`
  margin-bottom: 10px;
  font: 500 14px/14px ${fonts.SANS_SERIF};
  letter-spacing: 1px;
  color: ${colors.basic.WHITE};
  text-transform: uppercase;
`;
const FollowNewsroomLink = styled.a`
  margin-right: 20px;
`;

export interface ListingDetailHeaderProps {
  newsroomName: string;
  charter?: CharterData;
  registryURL?: string;
  registryLinkText?: string;
  owner: string;
  unstakedDeposit: string;
  isWhitelisted?: boolean;
  isRejected?: boolean;
  isInApplication?: boolean;
  canBeChallenged?: boolean;
  canBeWhitelisted?: boolean;
  inChallengeCommitVotePhase?: boolean;
  inChallengeRevealPhase?: boolean;
  canResolveChallenge?: boolean;
  isAwaitingAppealJudgement?: boolean;
  isAwaitingAppealChallenge?: boolean;
  isInAppealChallengeCommitPhase?: boolean;
  isInAppealChallengeRevealPhase?: boolean;
  canListingAppealChallengeBeResolved?: boolean;
}

export class ListingDetailHeader extends React.Component<ListingDetailHeaderProps> {
  public render(): JSX.Element {
    let newsroomDescription = "";
    let newsroomUrl = "";
    if (this.props.charter) {
      // TODO(toby) remove legacy `desc` after transition
      newsroomDescription = this.props.charter.tagline || (this.props.charter as any).desc;
      newsroomUrl = this.props.charter.newsroomUrl;
    }

    return (
      <ListingDetailOuter>
        <StyledListingDetailHeader>
          <GridRow>
            <LeftShark>
              {this.renderRegistryLink()}
              {this.renderPhaseLabel()}

              <ListingDetailNewsroomName>{this.props.newsroomName}</ListingDetailNewsroomName>
              <ListingDetailNewsroomDek>{newsroomDescription}</ListingDetailNewsroomDek>

              <NewsroomLinks>
                {newsroomUrl && (
                  <VisitNewsroomButtonWrap>
                    <Button size={buttonSizes.MEDIUM_WIDE} href={newsroomUrl} target="_blank">
                      Visit Newsroom 🡭
                    </Button>
                  </VisitNewsroomButtonWrap>
                )}

                {this.props.charter &&
                  this.props.charter.socialUrls &&
                  (this.props.charter.socialUrls.facebook || this.props.charter.socialUrls.twitter) && (
                    <FollowNewsroom>
                      <FollowNewsroomHeading>Follow Newsroom</FollowNewsroomHeading>
                      {this.props.charter.socialUrls.twitter && (
                        <FollowNewsroomLink href={this.props.charter.socialUrls.twitter} target="_blank">
                          <TwitterIcon />
                        </FollowNewsroomLink>
                      )}
                      {this.props.charter.socialUrls.facebook && (
                        <FollowNewsroomLink href={this.props.charter.socialUrls.facebook} target="_blank">
                          <FacebookIcon />
                        </FollowNewsroomLink>
                      )}
                    </FollowNewsroom>
                  )}
              </NewsroomLinks>
            </LeftShark>

            <RightShark>
              <dl>
                <dt>Owner</dt>
                <dd>{this.props.owner}</dd>

                <dt>Unstaked Deposit</dt>
                <dd>{this.props.unstakedDeposit}</dd>
              </dl>
            </RightShark>
          </GridRow>
        </StyledListingDetailHeader>
      </ListingDetailOuter>
    );
  }

  private renderRegistryLink(): JSX.Element | undefined {
    if (!this.props.registryURL) {
      return;
    }
    const label = this.props.registryLinkText || "Registry";
    return (
      <StyledRegistryLinkContainer>
        <Link to={this.props.registryURL}>&lt; Back to {label}</Link>
      </StyledRegistryLinkContainer>
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
}
