const CONFIGURE_WIZARD = 'configure-wizard';
const SETUP_CONTROL_PLANE_NODE = 'setup-control-plane-node';
const ADD_WORKER_NODE = 'add-worker-node';

export type RecipeTitles =
  | typeof CONFIGURE_WIZARD
  | typeof SETUP_CONTROL_PLANE_NODE
  | typeof ADD_WORKER_NODE;
export type Slide = {
  title: RecipeTitles;
  markdown: string;
};
export type Recipe = {
  recipeTitle: RecipeTitles;
  slides: Slide[];
};

export const RECIPE_TITLES: RecipeTitles[] = [CONFIGURE_WIZARD];

export const RECIPES: Recipe[] = [
  {
    recipeTitle: CONFIGURE_WIZARD,
    slides: [
      {
        title: CONFIGURE_WIZARD,
        markdown: `Markdown one`,
      },
      {
        title: SETUP_CONTROL_PLANE_NODE,
        markdown: `Markdown two`,
      },
      {
        title: ADD_WORKER_NODE,
        markdown: `Markdown three
          `,
      },
    ],
  },
];
