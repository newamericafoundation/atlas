(function() {
  describe('Atlas.Base.EntitiesApi', function() {
    var Mngr;
    Mngr = Atlas.Base.EntityManager;
    describe('getEntities', function() {
      return it('does not fire network request if the entities are cacheable', function() {
        var api, cache;
        api = new Mngr();
        cache = {
          models: [{}, {}, {}]
        };
        api.entitiesCache = cache;
        return api.getEntities({
          cache: true
        }).should.eql(cache);
      });
    });
    return describe('_getCachedEntity', function() {
      return it('returns undefined if the cache is empty', function() {
        var api, ref;
        api = new Mngr();
        return (ref = api._getCachedEntity({
          key: 'value'
        })) != null ? ref.should.equal(false) : void 0;
      });
    });
  });

}).call(this);

(function() {
  describe('Atlas.Entities.Project', function() {
    var model;
    model = void 0;
    beforeEach(function() {
      return model = new Atlas.Entities.ProjectModel();
    });
    return describe('parse', function() {
      return it('parses response data, making use of all sub-methods', function() {
        var parsedResp, resp;
        resp = [
          {
            template_name: 'Policy Brief',
            id: 5
          }
        ];
        parsedResp = {
          template_name: 'PolicyBrief',
          id: 5
        };
        return model.parse(resp, 'numerical_data').should.eql(parsedResp);
      });
    });
  });

}).call(this);

(function() {
  describe('Atlas.Entities.ProjectCollection', function() {
    var Coll;
    Coll = Atlas.Entities.ProjectCollection;
    return describe('#comparator', function() {
      var modelData1, modelData2, modelData3, modelData4;
      modelData1 = void 0;
      modelData2 = void 0;
      modelData3 = void 0;
      modelData4 = void 0;
      beforeEach(function() {
        modelData1 = {
          id: 1,
          title: 'C.',
          is_section_overview: 'Yes'
        };
        modelData2 = {
          id: 2,
          title: 'B.',
          is_section_overview: 'Yes'
        };
        modelData3 = {
          id: 3,
          title: 'Xtitla',
          is_section_overview: 'No'
        };
        return modelData4 = {
          id: 4,
          title: 'Xtitl.',
          is_section_overview: 'No'
        };
      });
      it('if both (or neither) are section overviews (:is_section_overview), sort by :title', function() {
        var coll;
        coll = new Coll([modelData1, modelData2]);
        return (coll.models[0].get('id')).should.equal(2);
      });
      it('if one is a section overview and the other is not, the section overview comes first regardless of the title', function() {
        var coll;
        coll = new Coll([modelData2, modelData1]);
        return coll.models[0].get('id').should.equal(2);
      });
      return it('passes integration test for three models', function() {
        var coll;
        coll = new Coll([modelData1, modelData2, modelData3, modelData4]);
        (coll.models[0].get('id')).should.equal(2);
        (coll.models[1].get('id')).should.equal(1);
        (coll.models[2].get('id')).should.equal(4);
        return (coll.models[3].get('id')).should.equal(3);
      });
    });
  });

}).call(this);

(function() {
  describe('Atlas.Assets', function() {
    return describe('svg', function() {
      var svg;
      svg = Atlas.Assets.svg;
      describe('_getPathNumbers', function() {
        return it('extracts numbers as strings from svg path without minus signs, adding an empty string between two delimiters', function() {
          return svg._getPathNumbers("M50,50C-100,100").should.eql(['', '50', '50', '', '100', '100']);
        });
      });
      describe('_getPathDelimiters', function() {
        return it('extracts delimiters including minus signs from numbers', function() {
          return svg._getPathDelimiters("M50,50C-100,100").should.eql(["M", ",", "C", "-", ","]);
        });
      });
      describe('_moveMinusSigns', function() {
        return it('moves minus signs from delimiters to numbers', function() {
          var delimiters, numbers;
          delimiters = ["M", ",", "C", "-", ","];
          numbers = ['', '50', '50', '', '100', '100'];
          svg._moveMinusSigns(delimiters, numbers);
          delimiters.should.eql(["M", ",", "C", "", ","]);
          return numbers.should.eql(['', '50', '50', '', '-100', '100']);
        });
      });
      describe('_rebuild', function() {
        return it('rebuilds svg path from delimiter and number arrays', function() {
          var delimiters, numbers;
          delimiters = ["M", ",", "C", "", ","];
          numbers = [NaN, '50', '50', NaN, '-100', '100'];
          return (svg._rebuild(delimiters, numbers)).should.eql("M50,50C-100,100");
        });
      });
      return describe('scalePath', function() {
        it('leaves path unchanged if scale factor is not provided', function() {
          return (svg.scalePath("M50,50C100,100")).should.eql("M50,50C100,100");
        });
        it('scales a simple path where the resulting coordinates are whole numbers', function() {
          return (svg.scalePath("M50,50C100,100", {
            scale: 0.5
          })).should.eql("M25,25C50,50");
        });
        return it('scales a simple path with three decimals accuracy', function() {
          return (svg.scalePath("M14,14C20,20", {
            scale: 0.0001
          })).should.eql("M0.001,0.001C0.002,0.002");
        });
      });
    });
  });

}).call(this);

(function() {
  describe('Atlas.CSS', function() {
    return describe('ClassBuilder', function() {
      return describe('#interpolate()', function() {
        it('defaults to 15 items', function() {
          return Atlas.CSS.ClassBuilder.interpolate(2, 3).should.equal(8);
        });
        return it('interpolates with specified color count', function() {
          Atlas.CSS.ClassBuilder.interpolate(2, 3, 5).should.equal(3);
          Atlas.CSS.ClassBuilder.interpolate(3, 4, 7).should.equal(5);
          return Atlas.CSS.ClassBuilder.interpolate(2, 3, 4).should.equal(3);
        });
      });
    });
  });

}).call(this);

(function() {
  describe('Atlas.Util.parsers', function() {
    var parsers;
    parsers = Atlas.Util.parsers;
    describe('removeArrayWrapper', function() {
      return it('builds model correctly if its data is wrapper in array brackets', function() {
        var parsedResp, resp;
        resp = [
          {
            key: 'value'
          }
        ];
        parsedResp = {
          key: 'value'
        };
        return (parsers.removeArrayWrapper(resp)).should.eql(parsedResp);
      });
    });
    return describe('adaptMongoId', function() {
      return it('extracts model id from mongoid $oid form', function() {
        var parsedResp, resp;
        resp = {
          id: {
            $oid: '1234'
          }
        };
        parsedResp = {
          id: '1234'
        };
        return (parsers.adaptMongoId(resp)).should.eql(parsedResp);
      });
    });
  });

}).call(this);

(function() {
  describe('Atlas.Util.templateHelpers', function() {
    return describe('#addDashOnLongWords()', function() {
      var fn;
      fn = Atlas.Util.templateHelpers.addDashOnLongWord;
      it('returns argument if it is null or undefined', function() {
        (fn(void 0) != null).should.equal(false);
        return (fn(null) != null).should.equal(false);
      });
      it('returns string when only short words are present', function() {
        return fn('straw').should.equal('straw');
      });
      return it('adds hyphen after third to last character', function() {
        return fn('strawberries').should.equal('strawber-ries');
      });
    });
  });

}).call(this);

(function() {
  describe('Atlas.Projects.Index', function() {
    var Index;
    Index = Atlas.Projects.Index;
    return describe('Index', function() {
      it('is a module', function() {
        return (Index != null).should.equal(true);
      });
      it('does not start with its parent module', function() {
        return Index.startWithParent.should.equal(false);
      });
      it('has a controller', function() {
        return (Index.Controller != null).should.equal(true);
      });
      return describe('start', function() {
        return it('starts the module', function() {
          return true.should.equal(true);
        });
      });
    });
  });

}).call(this);

(function() {
  describe('Atlas.Projects.Show.Tilemap.Entities.itemChecker', function() {
    var checker, data;
    data = void 0;
    checker = Atlas.Projects.Show.Tilemap.Entities.itemChecker;
    describe('findAndReplaceKey', function() {
      it('recognizes data having a standard key', function() {
        data = {
          lat: 100,
          long: 150
        };
        (checker.findAndReplaceKey(data, 'lat')).should.eql(true);
        return data.should.eql({
          lat: 100,
          long: 150
        });
      });
      return it('recognizes data with a key that is listed in the key format list', function() {
        data = {
          latitude: 100,
          long: 150
        };
        (checker.findAndReplaceKey(data, 'lat', ['lat', 'latitude'])).should.eql(true);
        return data.should.eql({
          lat: 100,
          long: 150
        });
      });
    });
    describe('pindrop', function() {
      it('recognizes and validates data with a latitude and longitude value; standardizes lat and long fields', function() {
        data = {
          latitude: 100,
          long: 150
        };
        (checker.pindrop(data)).should.eql({
          recognized: true,
          errors: []
        });
        return data.should.eql({
          lat: 100,
          long: 150,
          _itemType: 'pindrop'
        });
      });
      return it('recognizes and returns error for data with either latitude or longitude missing.', function() {
        data = {
          latitudezz: 100,
          long: 150
        };
        return (checker.pindrop(data)).should.eql({
          recognized: true,
          errors: ['Latitude or longitude not found.']
        });
      });
    });
    return describe('state', function() {
      it('recognizes and does not give errors for data with a state key and a correct state name in capitalized case; completes fields', function() {
        data = {
          name: 'New Jersey'
        };
        (checker.state(data)).should.eql({
          recognized: true,
          errors: []
        });
        return data.should.eql({
          name: 'New Jersey',
          code: 'NJ',
          id: 34,
          _itemType: 'state'
        });
      });
      it('recognizes and returns error for data with a state key but incorrect state name or case', function() {
        data = {
          name: 'new Jersey'
        };
        return (checker.state(data)).should.eql({
          recognized: true,
          errors: ['new Jersey not recognized as a state. Possibly a typo.']
        });
      });
      return it('does not recognize data without a name key', function() {
        data = {
          stateName: 'new Jersey'
        };
        return (checker.state(data)).should.eql({
          recognized: false
        });
      });
    });
  });

}).call(this);

(function() {
  describe('Atlas.Projects.Show.Tilemap.Entities.Model.ItemCollection', function() {
    describe('getValueList', function() {
      return it('returns value list for a given data key, removing duplicates', function() {
        var coll, json;
        json = [
          {
            key: 'value1'
          }, {
            key: 'value2'
          }, {
            key: 'value1'
          }, {
            key: 'value3'
          }, {
            key: 'value2'
          }, {
            key: 'value2'
          }
        ];
        coll = new Atlas.Projects.Show.Tilemap.Entities.ItemCollection(json);
        return coll.getValueList('key').should.eql(['value1', 'value2', 'value3']);
      });
    });
    describe('getLatLongBounds', function() {
      return it('returns latLng bounds as array of arrays', function() {
        var coll, json;
        json = [
          {
            lat: -40,
            long: +80
          }, {
            lat: +79,
            long: +80
          }, {
            lat: +40,
            long: +80
          }, {
            lat: +80,
            long: +40
          }
        ];
        coll = new Atlas.Projects.Show.Tilemap.Entities.ItemCollection(json);
        return coll.getLatLongBounds().should.eql([[-40, 40], [80, 80]]);
      });
    });
    return describe('toLatLongMultiPoint', function() {
      return it('returns latLng multipoint object', function() {
        var coll, json;
        json = [
          {
            lat: -40,
            long: 80
          }, {
            lat: +79,
            long: 80
          }
        ];
        coll = new Atlas.Projects.Show.Tilemap.Entities.ItemCollection(json);
        return coll.toLatLongMultiPoint().should.eql([[-40, 80], [79, 80]]);
      });
    });
  });

}).call(this);

(function() {
  describe('Atlas.Projects.Show.Tilemap.Entities.ItemModel', function() {
    var Model;
    Model = Atlas.Projects.Show.Tilemap.Entities.ItemModel;
    describe('toRichGeoFeature', function() {
      it('returns a GeoJSON point feature using lat and long attributes as coordinates', function() {
        var json, model;
        json = {
          lat: 1,
          long: 2,
          name: 'some name',
          attribute: 'some attribute'
        };
        model = new Model(json);
        return model.toRichGeoJsonFeature().should.eql({
          type: 'Feature',
          _model: model,
          geometry: {
            type: 'Point',
            coordinates: [2, 1]
          }
        });
      });
      return it('use default values Melbourne, Australia values if either latitude or longitude are not defined', function() {
        var json, model;
        json = {
          name: 'some name',
          attribute: 'some attribute'
        };
        model = new Model(json);
        return model.toRichGeoJsonFeature().should.eql({
          type: 'Feature',
          _model: model,
          geometry: {
            type: 'Point',
            coordinates: [145.0796161, -37.8602828]
          }
        });
      });
    });
    describe('_processValues', function() {
      var data;
      data = fixtures.tilemap_pindrop;
      it('removes leading and trailing whitespaces', function() {
        console.log(data.data.items[0]);
        return Model.prototype._processValues(data.data.items[0]).should.eql({
          "name": "California",
          "region": "west",
          "population": 38000000,
          "weather": "Excellent"
        });
      });
      it('breaks by | character and removes leading and trailing whitespaces', function() {
        return Model.prototype._processValues(data.data.items[1]).should.eql({
          "name": "Georgia",
          "region": "southeast",
          "population": 10000000,
          "weather": ["Good", "Ok"]
        });
      });
      return it('does not break by | character if there is a return character (\n), which indicates Markdown syntax.', function() {
        return Model.prototype._processValues(data.data.items[2]).should.eql({
          "name": "Vermont",
          "region": "northeast",
          "population": 600000,
          "weather": "Ok|Nice when things are\njolly"
        });
      });
    });
    return describe('matchesSearchTerm', function() {
      return it('matches search term on the name attribute', function() {
        var m;
        m = new Model({
          name: 'Fancy Name'
        });
        return m.matchesSearchTerm('ncy n').should.equal(true);
      });
    });
  });

}).call(this);

(function() {
  describe('Filter.modelBuilder', function() {
    var F;
    F = Atlas.Projects.Show.Tilemap.Filter;
    return describe('buildNumericalFilter', function() {
      it('builds filter including +/- infinity values if leading and trailing delimiter marks are present', function() {
        return F.buildNumericalFilter('|100|200|300|').should.eql([
          {
            min: -1000000,
            max: 100,
            value: 'Less than 100'
          }, {
            min: 100,
            max: 200,
            value: 'Between 100 and 200'
          }, {
            min: 200,
            max: 300,
            value: 'Between 200 and 300'
          }, {
            min: 300,
            max: +1000000,
            value: 'Greater than 300'
          }
        ]);
      });
      it('builds filter including - infinity values if only leading delimiter mark is present', function() {
        return F.buildNumericalFilter('|100|200|300').should.eql([
          {
            min: -1000000,
            max: 100,
            value: 'Less than 100'
          }, {
            min: 100,
            max: 200,
            value: 'Between 100 and 200'
          }, {
            min: 200,
            max: 300,
            value: 'Between 200 and 300'
          }
        ]);
      });
      return it('builds filter including + infinity values if only trailing delimiter mark is present', function() {
        return F.buildNumericalFilter('100|200|300|').should.eql([
          {
            min: 100,
            max: 200,
            value: 'Between 100 and 200'
          }, {
            min: 200,
            max: 300,
            value: 'Between 200 and 300'
          }, {
            min: 300,
            max: +1000000,
            value: 'Greater than 300'
          }
        ]);
      });
    });
  });

}).call(this);

(function() {
  describe('Atlas.Projects.Show.Tilemap.Filter.Model', function() {
    var filter, obj;
    obj = void 0;
    filter = void 0;
    beforeEach(function() {
      obj = {
        activeIndex: 0,
        variables: [
          {
            variable_id: 'origin',
            _isActive: true,
            options: [
              {
                value: 'ethiopia',
                _isActive: true
              }, {
                value: 'indonesia',
                _isActive: true
              }, {
                value: 'nicaragua',
                _isActive: true
              }
            ]
          }, {
            variable_id: 'roast',
            _isActive: true,
            options: [
              {
                value: 'dark',
                _isActive: true
              }, {
                value: 'light',
                _isActive: true
              }
            ]
          }
        ]
      };
      return filter = new Atlas.Projects.Show.Tilemap.Filter.Model(obj);
    });
    describe('constructor', function() {
      it('builds nested structure', function() {
        return filter.children[0].get('variable_id').should.equal('origin');
      });
      return it('builds double nested structure', function() {
        return filter.children[1].children[1].get('value').should.equal('light');
      });
    });
    describe('test grandchildren', function() {
      return it('deactivates model', function() {
        var grandchild;
        grandchild = filter.children[0].children[0];
        grandchild.test({
          'origin': 'ethiopia'
        }).should.equal(true);
        grandchild.deactivate();
        return grandchild.test({
          'origin': 'ethiopia'
        }).should.equal(false);
      });
    });
    describe('test children', function() {
      it('tests data that has tested data key', function() {
        var child;
        child = filter.children[0];
        return child.test({
          'origin': 'ethiopia'
        }).should.equal(true);
      });
      return it('tests data that does not have tested data key', function() {
        var child;
        child = filter.children[0];
        return child.test({
          'roast': 'light'
        }).should.equal(false);
      });
    });
    return describe('test main', function() {
      it('tests data that has tested data key', function() {
        return filter.test({
          'origin': 'ethiopia'
        }).should.equal(true);
      });
      return it('tests data that does not have tested data key', function() {
        return filter.test({
          'roast': 'light'
        }).should.equal(false);
      });
    });
  });

}).call(this);
