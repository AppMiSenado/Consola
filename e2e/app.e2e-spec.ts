import { ConsolePage } from './app.po';

describe('console App', () => {
  let page: ConsolePage;

  beforeEach(() => {
    page = new ConsolePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
