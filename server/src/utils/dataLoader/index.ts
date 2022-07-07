import { Upvote, User } from "../../entities";
import DataLoader from "dataloader";

interface IVoteTypeConditions {
    postID: number;
    userID: number;
}

const batchGetUsers = async (userIds: number[]) => {
    const users = await User.findByIds(userIds);
    return userIds.map((userID) => users.find((user) => user.id === userID));
};

// SELECT * FROM Upvote WHERE [postID, userID] IN ([[19,1], [18,1], [17,1]])
const batchGetVoteTypes = async (voteTypeConditions: IVoteTypeConditions[]) => {
    const voteTypes = await Upvote.findByIds(voteTypeConditions);
    return voteTypeConditions.map((voteTypeCondition) =>
        voteTypes.find(
            (voteType) =>
                voteType.postID === voteTypeCondition.postID &&
                voteType.userID === voteTypeCondition.userID
        )
    );
};

export const buildDataLoaders = () => ({
    userLoader: new DataLoader<number, User | undefined>((userIDs) =>
        batchGetUsers(userIDs as number[])
    ),
    voteTypeLoader: new DataLoader<IVoteTypeConditions, Upvote | undefined>(
        (voteTypeConditions) =>
            batchGetVoteTypes(voteTypeConditions as IVoteTypeConditions[])
    ),
});
