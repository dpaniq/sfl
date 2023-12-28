export type Link = {
  name: string;
  href: string;
  icon?: string;
  fragment?: string;
};

export type TreePage = {
  title: string;
  url: string;
  icon?: string;
  subPages?: TreePage[];
};
