/// <reference path="../knockout.d.ts"/>
/// <reference path="../knockout.mapping.d.ts"/>
/// <reference path="../jquery.d.ts"/>
/// <reference path="../models/equipment.ts"/>
/// <reference path="../lang.ts" />
/// <reference path="../includes.d.ts"/>
var Kanai;
(function (Kanai) {
    var VM;
    (function (VM) {
        var Site = (function () {
            function Site() {
                this.localStorageString = "kanai_cube";
                var self = this;
                this.Weapons = ko.observableArray();
                this.Jewelry = ko.observableArray();
                this.Armor = ko.observableArray();
                this.hideCubed = ko.observable(false).extend({ notify: 'always' });
                this.hideCubedNonSeason = ko.observable(false).extend({ notify: 'always' });
                this.nonSeasonalProgressBar = ko.observable(false).extend({ notify: 'always' });
                this.hideNonSeasonalCheckboxes = ko.observable(false).extend({ notify: 'always' });
                this.hideSeasonalCheckboxes = ko.observable(false).extend({ notify: 'always' });
                this.seasonalProgressBar = ko.observable(true).extend({ notify: 'always' });
                this.bothProgressBar = ko.observable(false).extend({ notify: 'always' });
                this.AllWeapons = new Array();
                this.AllJewelry = new Array();
                this.AllArmor = new Array();
                this.Export = ko.observable();
                this.Import = ko.observable();
                this.Search = ko.observable('').extend({ notify: 'always', rateLimit: 200 });
                this.FilteredArray = ko.observableArray([]);
                this.Search.subscribe(function (searchText) {
                    if (searchText && searchText.length >= 2) {
                        //we need to search the array
                        self.FilteredArray([]);
                        self.searchArray(self.Armor, searchText, self.FilteredArray);
                        self.searchArray(self.Weapons, searchText, self.FilteredArray);
                        self.searchArray(self.Jewelry, searchText, self.FilteredArray);
                        if (self.FilteredArray().length > 0) {
                            self.FilteredArray.valueHasMutated();
                            $("a[href='#panel-search']").tab("show");
                        }
                    }
                    else {
                        $("a[href='#panel-armor']").tab("show");
                        self.FilteredArray([]);
                        $(".sticky").removeClass('sticky');
                        $(".sticky-progress").removeClass("sticky-progress");
                        $(".sticky-table").removeClass('sticky-table');
                    }
                });
            }
            Site.prototype.searchArray = function (array, searchText, response) {
                var res = ko.utils.arrayFilter(array(), function (item) {
                    var lowerItemName = ko.unwrap(item.itemName).toString().toLowerCase();
                    return lowerItemName.indexOf(searchText) !== -1;
                });
                ko.utils.arrayPushAll(response(), res);
                return res.length > 0;
            };
            Site.prototype.clear = function () {
                this.Weapons([]);
                this.Jewelry([]);
                this.Armor([]);
            };
            Site.prototype.init = function () {
                var _this = this;
                var self = this;
                var vm = JSON.parse(localStorage.getItem(self.localStorageString));
                if (!vm) {
                    this.loadWeapons(self.Weapons);
                    this.loadJewelry(self.Jewelry);
                    this.loadArmor(self.Armor);
                    self.loadJewelry(self.AllJewelry);
                    self.loadArmor(self.AllWeapons);
                    self.loadWeapons(self.AllArmor);
                    this.Weapons.sort(function (left, right) {
                        return left().itemName() == right().itemName() ? 0 : (left().itemName() < right().itemName() ? -1 : 1);
                    });
                    this.Armor.sort(function (left, right) {
                        return left().itemName() == right().itemName() ? 0 : (left().itemName() < right().itemName() ? -1 : 1);
                    });
                    this.Jewelry.sort(function (left, right) {
                        return left().itemName() == right().itemName() ? 0 : (left().itemName() < right().itemName() ? -1 : 1);
                    });
                    localStorage.setItem(self.localStorageString, ko.mapping.toJSON(this));
                    $.each(self.Armor(), function (i, elem) {
                        elem().isCubedSeason.subscribe(function (newValue) {
                            self.saveToLocalStorage();
                        });
                        elem().isCubedNonSeason.subscribe(function (newValue) {
                            self.saveToLocalStorage();
                        });
                        elem().isStashed.subscribe(function (newValue) {
                            self.saveToLocalStorage();
                        });
                    });
                    $.each(self.Weapons(), function (i, elem) {
                        elem().isCubedSeason.subscribe(function (newValue) {
                            self.saveToLocalStorage();
                        });
                        elem().isCubedNonSeason.subscribe(function (newValue) {
                            self.saveToLocalStorage();
                        });
                        elem().isStashed.subscribe(function (newValue) {
                            self.saveToLocalStorage();
                        });
                    });
                    $.each(self.Jewelry(), function (i, elem) {
                        elem().isCubedSeason.subscribe(function (newValue) {
                            self.saveToLocalStorage();
                        });
                        elem().isCubedNonSeason.subscribe(function (newValue) {
                            self.saveToLocalStorage();
                        });
                        elem().isStashed.subscribe(function (newValue) {
                            self.saveToLocalStorage();
                        });
                    });
                }
                else {
                    if (vm.Jewelery) {
                        if (!self.Jewelry) {
                            self.Jewelry = ko.observableArray();
                        }
                        for (var i = 0; i < vm.Jewelery.length; i++) {
                            self.Jewelry.push(ko.mapping.fromJS(vm.Jewelery[i]));
                        }
                        delete vm.Jewelery;
                        vm.Jewelry = self.Jewelry();
                    }
                    if (!vm.Jewelry) {
                        if (!self.Jewelry) {
                            self.Jewelry = ko.observableArray();
                        }
                    }
                    ko.mapping.fromJS(vm, { "include": ["hideCubed", "hideCubedNonSeason", "nonSeasonalProgressBar", "seasonalProgressBar", "bothProgressBar"] }, self);
                    this.checkConsistency();
                    this.saveToLocalStorage();
                    $.each(self.Armor(), function (i, elem) {
                        elem.isCubedSeason.subscribe(function (newValue) {
                            self.saveToLocalStorage();
                        });
                        elem.isCubedNonSeason.subscribe(function (newValue) {
                            self.saveToLocalStorage();
                        });
                        elem.isStashed.subscribe(function (newValue) {
                            self.saveToLocalStorage();
                        });
                    });
                    $.each(self.Weapons(), function (i, elem) {
                        elem.isCubedSeason.subscribe(function (newValue) {
                            self.saveToLocalStorage();
                        });
                        elem.isCubedNonSeason.subscribe(function (newValue) {
                            self.saveToLocalStorage();
                        });
                        elem.isStashed.subscribe(function (newValue) {
                            self.saveToLocalStorage();
                        });
                    });
                    $.each(self.Jewelry(), function (i, elem) {
                        elem.isCubedSeason.subscribe(function (newValue) {
                            self.saveToLocalStorage();
                        });
                        elem.isCubedNonSeason.subscribe(function (newValue) {
                            self.saveToLocalStorage();
                        });
                        elem.isStashed.subscribe(function (newValue) {
                            self.saveToLocalStorage();
                        });
                    });
                    self.saveToLocalStorage();
                }
                this.ArmorSeasonalCubedCount = ko.computed(function () {
                    if (self.Armor().length > 0) {
                        return ko.utils.arrayFilter(self.Armor(), function (item) {
                            var elem = ko.unwrap(item);
                            return elem.isCubedSeason();
                        }).length;
                    }
                });
                this.WeaponSeasonalCubedCount = ko.computed(function () {
                    if (self.Weapons().length > 0) {
                        return ko.utils.arrayFilter(self.Weapons(), function (item) {
                            var elem = ko.unwrap(item);
                            return elem.isCubedSeason();
                        }).length;
                    }
                });
                this.JewelrySeasonalCubedCount = ko.computed(function () {
                    if (self.Jewelry().length > 0) {
                        return ko.utils.arrayFilter(self.Jewelry(), function (item) {
                            var elem = ko.unwrap(item);
                            return elem.isCubedSeason();
                        }).length;
                    }
                });
                this.ArmorNonSeasonalCubedCount = ko.computed(function () {
                    if (self.Armor().length > 0) {
                        return ko.utils.arrayFilter(self.Armor(), function (item) {
                            var elem = ko.unwrap(item);
                            return elem.isCubedNonSeason();
                        }).length;
                    }
                });
                this.WeaponNonSeasonalCubedCount = ko.computed(function () {
                    if (self.Weapons().length > 0) {
                        return ko.utils.arrayFilter(self.Weapons(), function (item) {
                            var elem = ko.unwrap(item);
                            return elem.isCubedNonSeason();
                        }).length;
                    }
                });
                this.JewelryNonSeasonalCubedCount = ko.computed(function () {
                    if (self.Jewelry().length > 0) {
                        return ko.utils.arrayFilter(self.Jewelry(), function (item) {
                            var elem = ko.unwrap(item);
                            return elem.isCubedNonSeason();
                        }).length;
                    }
                });
                this.ArmorStashedCount = ko.computed(function () {
                    return ko.utils.arrayFilter(self.Armor(), function (item) {
                        var elem = ko.unwrap(item);
                        return elem.isStashed() && !(elem.isCubedNonSeason() || elem.isCubedSeason());
                    }).length;
                });
                this.WeaponStashedCount = ko.computed(function () {
                    return ko.utils.arrayFilter(self.Weapons(), function (item) {
                        var elem = ko.unwrap(item);
                        return elem.isStashed() && !(elem.isCubedNonSeason() || elem.isCubedSeason());
                    }).length;
                });
                this.JewelryStashedCount = ko.computed(function () {
                    return ko.utils.arrayFilter(self.Jewelry(), function (item) {
                        var elem = ko.unwrap(item);
                        return elem.isStashed() && !(elem.isCubedNonSeason() || elem.isCubedSeason());
                    }).length;
                });
                this.ArmorBothCubedCount = ko.computed(function () {
                    return ko.utils.arrayFilter(self.Armor(), function (item) {
                        var elem = ko.unwrap(item);
                        return elem.isCubedNonSeason() || elem.isCubedSeason();
                    }).length;
                });
                this.WeaponBothCubedCount = ko.computed(function () {
                    return ko.utils.arrayFilter(self.Weapons(), function (item) {
                        var elem = ko.unwrap(item);
                        return elem.isCubedNonSeason() || elem.isCubedSeason();
                    }).length;
                });
                this.JewelryBothCubedCount = ko.computed(function () {
                    return ko.utils.arrayFilter(self.Jewelry(), function (item) {
                        var elem = ko.unwrap(item);
                        return elem.isCubedNonSeason() || elem.isCubedSeason();
                    }).length;
                });
                this.StashedCount = ko.computed(function () {
                    return _this.JewelryStashedCount() + _this.WeaponStashedCount() + _this.ArmorStashedCount();
                });
                this.hideCubed.subscribe(function () { self.saveToLocalStorage(); });
                this.hideCubedNonSeason.subscribe(function () { self.saveToLocalStorage(); });
                this.nonSeasonalProgressBar.subscribe(function () { self.saveToLocalStorage(); });
                this.seasonalProgressBar.subscribe(function () { self.saveToLocalStorage(); });
                this.bothProgressBar.subscribe(function () { self.saveToLocalStorage(); });
            };
            Site.prototype.fillExport = function () {
                var self = this;
                this.Export(ko.mapping.toJSON(self));
            };
            Site.prototype.saveToLocalStorage = function () {
                var self = this;
                localStorage[self.localStorageString] = null;
                delete this.Jewelery;
                localStorage.setItem(self.localStorageString, ko.mapping.toJSON(self, {
                    "ignore": ["AllWeapons", "AllJewelry", "FilteredArray", "Search", "Export", "AllArmor", "ArmorNonSeasonalCubedCount", "ArmorSeasonalCubedCount", "ArmorStashedCount", "JewelryNonSeasonalCubedCount", "JewelrySeasonalCubedCount", "JewelryStashedCount", "StashedCount", "WeaponNonSeasonalCubedCount", "WeaponSeasonalCubedCount", "WeaponStashedCount", "ArmorBothCubedCount", "WeaponBothCubedCount", "JewelryBothCubedCount"] }));
            };
            // This function will return correct spelling of words that I typoed at some time without destroying user data or duplicating records
            Site.prototype.spellcheckCorrect = function (searchName) {
                switch (searchName) {
                    case "Gundo Gear":
                        return { oldName: "Gundo Gear", newName: "Gungdo Gear" };
                    case "HwoJ Wrap":
                        return { oldName: "HwoJ Wrap", newName: "Hwoj Wrap" };
                    case "Illusionary Boots":
                        return { oldName: "Illusionary Boots", newName: "Illusory Boots" };
                    case "Remorsless":
                        return { oldName: "Remorsless", newName: "Remorseless" };
                    case "Ahavarion,Spear of Lycander":
                        return { oldName: "Ahavarion,Spear of Lycander", newName: "Ahavarion, Spear of Lycander" };
                    case "Chaigmail":
                        return { oldName: "Chaigmail", newName: "Chaingmail" };
                }
                return null;
            };
            Site.prototype._checkConsistencyAndSort = function (searchArray, masterList) {
                var self = this;
                for (var i = 0; i < masterList.length; i++) {
                    var searchName = masterList[i]().itemName();
                    var find = ko.utils.arrayFirst(searchArray(), function (item) {
                        var spellCheck = self.spellcheckCorrect(item.itemName());
                        if (spellCheck && spellCheck.oldName == item.itemName()) {
                            item.itemName(spellCheck.newName);
                        }
                        return item.itemName() === searchName;
                    });
                    if (find == null) {
                        var find2 = ko.utils.arrayFirst(searchArray(), function (item) {
                            var convert = lang.englishToCulture(item);
                            return convert.itemName() === searchName;
                        });
                        if (find2 == null) {
                            searchArray.push(ko.mapping.fromJS(masterList[i])());
                        }
                        else {
                            var convert = lang.englishToCulture(find2);
                            find2.itemName(convert.itemName());
                            find2.affix = convert.affix;
                        }
                    }
                    else {
                        find.affix = masterList[i]().affix;
                    }
                    searchArray.sort(function (left, right) {
                        return left.itemName() == right.itemName() ? 0 : (left.itemName() < right.itemName() ? -1 : 1);
                    });
                }
            };
            Site.prototype.importValues = function () {
                var self = this;
                if (self.Import()) {
                    if (confirm(lang.importConfirm())) {
                        var importData = ko.mapping.fromJSON(self.Import());
                        self.Jewelry(importData.Jewelry());
                        self.Armor(importData.Armor());
                        self.Weapons(importData.Weapons());
                        self.saveToLocalStorage();
                    }
                }
            };
            Site.prototype.checkConsistency = function () {
                var self = this;
                this.AllWeapons.length = 0;
                this.AllJewelry.length = 0;
                this.AllArmor.length = 0;
                this.loadWeapons(this.AllWeapons);
                this.loadJewelry(this.AllJewelry);
                this.loadArmor(this.AllArmor);
                self._checkConsistencyAndSort(self.Armor, self.AllArmor);
                self._checkConsistencyAndSort(self.Weapons, self.AllWeapons);
                //This item didn't make it live in 2.3
                var item = ko.utils.arrayFirst(self.Weapons(), function (item) {
                    return item.itemName() == "Deadly Rebirth";
                });
                if (item) {
                    self.Weapons.remove(item);
                }
                self._checkConsistencyAndSort(self.Jewelry, self.AllJewelry);
                self.saveToLocalStorage();
            };
            Site.prototype.loadFromLocalStorage = function (vm) {
                this.Armor = vm.Armor;
                this.Weapons = vm.Weapons;
                this.Jewelry = vm.Jewelry;
            };
            Site.prototype.loadArmor = function (target) {
                lang.getArmor(target);
            };
            Site.prototype.loadWeapons = function (target) {
                lang.getWeapons(target);
            };
            Site.prototype.loadJewelry = function (target) {
                lang.getJewelry(target);
            };
            return Site;
        })();
        VM.Site = Site;
    })(VM = Kanai.VM || (Kanai.VM = {}));
})(Kanai || (Kanai = {}));
