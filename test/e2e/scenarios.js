'use strict';

describe('angularCollective start', function(){
  var scrollIntoView;
  beforeEach(function(){
    browser.get('http://localhost:3001/#!');
    scrollIntoView = function () {
	arguments[0].scrollIntoView();
    }
  });


  describe('angularCollective app main', function(){

    it('should show A-Z filter', function(){
      expect(element.all(by.css('.nav.nav-tabs > li.active')).count()).toEqual(1);
    });

    it('should show five repos', function(){
      expect(element.all(by.css('div.tab-pane.active  div.module')).count()).toEqual(5);
    });

    it('should show angular-carousel — angular as first element', function(){
      expect(element(by.css('div.tab-pane.active div.name')).getText()).toEqual('angular-carousel — angular');
    });


    it('should load second page when clicked on button', function(){
      element(by.css('div.tab-pane.active .pagination>li.active+li>a')).then(function(el){
	el.click();
	});
      expect(browser.getCurrentUrl()).toBe('http://localhost:3001/#!/?sort=Descending&sortBy=lowerCaseName&page=2');
    });

  });

  describe('angularCollective modal window', function(){
    beforeEach(function(){
      element(by.css('div.tab-pane.active label:nth-child(2)')).click();
    });


    it('should load details modal window when clicked on "Details" button', function(){
        expect(element(by.css('.modal-title')).getText()).toContain('angular-carousel — angular');
    })

    it('should change url of page when clicked on "Details" button', function(){
      expect(browser.getCurrentUrl()).toBe('http://localhost:3001/#!/?sort=Descending&sortBy=lowerCaseName&details=angular%2Fangular-carousel');
    })

    it('should close modal window when clicked on "Close" button', function(){
      element(by.css('div.modal button')).click();
      expect(browser.getCurrentUrl()).toBe('http://localhost:3001/#!/?sort=Descending&sortBy=lowerCaseName');
    });

    it('should load modal window when user enters page with details id in search query', function(){
      browser.get('http://localhost:3001/#!/?sort=Descending&sortBy=lowerCaseName&page=2&details=angular%2Fangular-hint-dom');
      expect(element(by.css('.modal-title')).getText()).toContain('angular-hint-dom — angular');
    });

    it('should load from API when details are not on the same page as earlier', function(){
      browser.get('http://localhost:3001/#!/?sort=Descending&sortBy=lowerCaseName&page=1&details=angular%2Fangular-hint-dom');
      expect(element(by.css('.modal-title')).getText()).toContain('angular-hint-dom — angular');
    });


    it('should load readme file when opening details', function(){
      expect(element(by.css('.tab-pane.active > div > div > p')).getText()).toContain('This was an early experiment. It used to work, and might still work, but a more flexible and much better documented carousel directive developed by the Angular community can be found here.');
    });

    it('should load comments tab when clicking comments when details are shown', function(){
      browser.get('http://localhost:3001/#!/?sort=Descending&sortBy=lowerCaseName&page=1&details=angular%2Fangular-carousel');
      element(by.css('.modal ul.nav-tabs li:nth-child(2)')).click();
      expect(element.all(by.css('#disqus_thread')).count()).toEqual(1);
    });

  });


  describe('angularCollective tabs', function(){
    beforeEach(function(){
      element(by.css('.nav.nav-tabs li:nth-child(5) > a')).click();
    });

    it('should load Directives only when clicked on Directives Tab', function(){
      expect(element(by.css('div.tab-pane.active div.name')).getText()).toContain('angular-hint-directives — angular');
    });

    it('should change address bar when clicked on Directives Tab', function(){
      expect(browser.getCurrentUrl()).toBe('http://localhost:3001/#!/?sort=Descending&sortBy=lowerCaseName&filter=Directives&page=1');
    });

  });


  describe('angularCollective search', function(){
    beforeEach(function(){
      element(by.model('query')).sendKeys('m');
      element(by.css('button.searchButton')).click();
    });

    it('should show search results when typed query and clicked search', function(){
      browser.sleep(1000);
	expect(element(by.css('.repoList div.name')).getText()).toContain('templating — angular');
    });

    it('should show search results when typed query and clicked search', function(){
        expect(browser.getCurrentUrl()).toBe('http://localhost:3001/#!/search/m?sort=Descending&sortBy=lowerCaseName');

    });

    it('should load search results when entered url with search', function(){
        browser.get('http://localhost:3001/#!/search/m?sort=Descending&sortBy=lowerCaseName');
	expect(element(by.css('.repoList div.name')).getText()).toContain('templating — angular');
    });

    it('should escape wrong query', function(){
      element(by.model('query')).sendKeys('test!@#$% !@#$');
      element(by.css('button.searchButton')).click();
      expect(browser.getCurrentUrl()).toBe('http://localhost:3001/#!/search/test----------?sort=Descending&sortBy=lowerCaseName');
    });

  });

});
