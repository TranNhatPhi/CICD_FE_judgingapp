import { z } from "zod";

import {
  TCriteria,
  TProjectRound1,
  TRound1MarkRequest,
} from "~/store/features/projects/entity";

export type TRound1MarkFormSchema = Omit<TRound1MarkRequest, "judgeId">;

// criteria is an array of criteriaId
export const MarkingRound1Schema = z.object({
  criteria: z.object({
    criteria1: z.number(),
    criteria2: z.number(),
    criteria3: z.number(),
    criteria4: z.number(),
    criteria5: z.number(),
    criteria6: z.number(),
    criteria7: z.number(),
    criteria8: z.number(),
  }),
  comment: z.string().optional(),
});

export type TMarkingRound1Schema = {
  criteria: { [key: string]: number };
  comment?: string;
};

export const convertCriteriaMarkToSchema = (
  round1Project: TProjectRound1,
  criteriaList: TCriteria[],
) => {
  if (!Object.keys(round1Project.criteriaMark).length) {
    return criteriaList.reduce<{
      criteria: {
        [key: string]: number;
      };
    }>(
      (cur, _, idx) => {
        cur.criteria[`criteria${idx + 1}`] = 1;
        return cur;
      },
      { criteria: {} },
    );
  }
  return Object.keys(round1Project.criteriaMark)?.reduce<{
    criteria: {
      [key: string]: number;
    };
  }>(
    (cur, item, idx) => {
      cur.criteria[`criteria${idx + 1}`] = round1Project.criteriaMark[item] - 4;
      return cur;
    },
    { criteria: {} },
  );
};
