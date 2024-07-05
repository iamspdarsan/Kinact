"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var https_1 = require("https");
var path_1 = require("path");
var RequestOption = /** @class */ (function () {
    function RequestOption(path) {
        this.hostname = "api.github.com";
        this.headers = {
            "user-agent": "Node.js",
            Authorization: "Bearer ".concat(process.env.GITHUB_TOKEN),
            Accept: "application/json",
        };
        this.path = "";
        this.path = path;
    }
    return RequestOption;
}());
function parseRepoMeta(ghResponse) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1;
    return {
        name: (_a = ghResponse.name) !== null && _a !== void 0 ? _a : "",
        owner: {
            login: (_c = (_b = ghResponse.owner) === null || _b === void 0 ? void 0 : _b.login) !== null && _c !== void 0 ? _c : "",
            type: (_e = (_d = ghResponse.owner) === null || _d === void 0 ? void 0 : _d.type) !== null && _e !== void 0 ? _e : "",
        },
        htmlUrl: (_f = ghResponse.html_url) !== null && _f !== void 0 ? _f : "",
        description: (_g = ghResponse.description) !== null && _g !== void 0 ? _g : "",
        fork: (_h = ghResponse.fork) !== null && _h !== void 0 ? _h : "",
        url: (_j = ghResponse.url) !== null && _j !== void 0 ? _j : "",
        releasesUrl: (_k = ghResponse.releases_url) !== null && _k !== void 0 ? _k : "",
        languagesUrl: (_l = ghResponse.languages_url) !== null && _l !== void 0 ? _l : "",
        contributorsUrl: (_m = ghResponse.contributors_url) !== null && _m !== void 0 ? _m : "",
        createdAt: (_o = ghResponse.created_at) !== null && _o !== void 0 ? _o : "",
        updatedAt: (_p = ghResponse.updated_at) !== null && _p !== void 0 ? _p : "",
        homepage: (_q = ghResponse.homepage) !== null && _q !== void 0 ? _q : "",
        stargazersCount: (_r = ghResponse.stargazers_count) !== null && _r !== void 0 ? _r : "",
        watchersCount: (_s = ghResponse.watchers_count) !== null && _s !== void 0 ? _s : "",
        language: (_t = ghResponse.language) !== null && _t !== void 0 ? _t : "",
        forksCount: (_u = ghResponse.forks_count) !== null && _u !== void 0 ? _u : "",
        archived: (_v = ghResponse.archived) !== null && _v !== void 0 ? _v : "",
        openIssuesCount: (_w = ghResponse.open_issues_count) !== null && _w !== void 0 ? _w : "",
        license: {
            name: (_y = (_x = ghResponse.license) === null || _x === void 0 ? void 0 : _x.name) !== null && _y !== void 0 ? _y : "",
            spdxId: (_0 = (_z = ghResponse.license) === null || _z === void 0 ? void 0 : _z.spdx_id) !== null && _0 !== void 0 ? _0 : "",
        },
        topics: (_1 = ghResponse.topics) !== null && _1 !== void 0 ? _1 : "",
    };
}
function getReposMeta(user) {
    var _this = this;
    var path = "/users/".concat(user, "/repos");
    var options = new RequestOption(path);
    return new Promise(function (resolve, reject) {
        (0, https_1.get)(options, function (res) {
            var data = "";
            res.on("data", function (chunk) {
                data += chunk;
            });
            res.on("end", function () { return __awaiter(_this, void 0, void 0, function () {
                var ghResponse, reposMeta, _i, ghResponse_1, repoMetaRaw, repoMeta, languagesMeta, _a;
                var _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!(res.statusCode === 200)) return [3 /*break*/, 8];
                            ghResponse = JSON.parse(data);
                            reposMeta = [];
                            _i = 0, ghResponse_1 = ghResponse;
                            _c.label = 1;
                        case 1:
                            if (!(_i < ghResponse_1.length)) return [3 /*break*/, 7];
                            repoMetaRaw = ghResponse_1[_i];
                            repoMeta = parseRepoMeta(repoMetaRaw);
                            languagesMeta = {};
                            _c.label = 2;
                        case 2:
                            _c.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, getLanguagesMeta((_b = repoMeta.languagesUrl) !== null && _b !== void 0 ? _b : "")];
                        case 3:
                            languagesMeta = _c.sent();
                            delete repoMeta.languagesUrl;
                            return [3 /*break*/, 5];
                        case 4:
                            _a = _c.sent();
                            console.log("⚠️ Error Getting languages meta");
                            return [3 /*break*/, 5];
                        case 5:
                            reposMeta.push(__assign(__assign({}, repoMeta), { languagesMeta: languagesMeta }));
                            _c.label = 6;
                        case 6:
                            _i++;
                            return [3 /*break*/, 1];
                        case 7:
                            resolve(reposMeta);
                            return [3 /*break*/, 9];
                        case 8:
                            reject("Error code:" + res.statusCode);
                            _c.label = 9;
                        case 9: return [2 /*return*/];
                    }
                });
            }); });
        }).on("error", function (err) {
            reject(err);
        });
    });
}
function getMostUsedLanguages(rawGHMEta) {
    var mostUsedLanguages = new Set();
    rawGHMEta.forEach(function (repoMeta) {
        mostUsedLanguages.add(repoMeta.language);
    });
    return Array.from(mostUsedLanguages).filter(function (lang) { return lang; });
}
function makeRepoGroups(uniqueLangs, rawGHMEta) {
    var groupsMeta = {};
    uniqueLangs.forEach(function (language) {
        var groupedMeta = rawGHMEta.filter(function (repoMeta) { return repoMeta.language === language; });
        groupsMeta[language] = groupedMeta;
    });
    return groupsMeta;
}
function getLanguagesMeta(languageURL) {
    return new Promise(function (resolve, reject) {
        var path = new URL(languageURL).pathname;
        var options = new RequestOption(path);
        (0, https_1.get)(options, function (response) {
            var data = "";
            response.on("data", function (chunk) {
                data += chunk;
            });
            response.on("end", function () {
                if (response.statusCode === 200) {
                    var languagesMeta = JSON.parse(data);
                    resolve(languagesMeta);
                }
                else {
                    reject(response.statusCode);
                }
            });
        }).on("error", function (err) {
            reject(err);
        });
    });
}
var loadGithubMeta = function () { return __awaiter(void 0, void 0, void 0, function () {
    var workedOn, reposMeta, _i, workedOn_1, page, currentPageReposMeta;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                workedOn = ["iamspdarsan", "cresteem"];
                reposMeta = [];
                _i = 0, workedOn_1 = workedOn;
                _a.label = 1;
            case 1:
                if (!(_i < workedOn_1.length)) return [3 /*break*/, 4];
                page = workedOn_1[_i];
                return [4 /*yield*/, getReposMeta(page)];
            case 2:
                currentPageReposMeta = _a.sent();
                /* filter */
                reposMeta.push.apply(reposMeta, currentPageReposMeta);
                _a.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/, reposMeta];
        }
    });
}); };
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var rawGHMEta, err_1, mostUsedLanguages, groupedMeta;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rawGHMEta = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, loadGithubMeta()];
                case 2:
                    rawGHMEta = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.log(err_1);
                    process.exit(1);
                    return [3 /*break*/, 4];
                case 4:
                    mostUsedLanguages = getMostUsedLanguages(rawGHMEta);
                    groupedMeta = makeRepoGroups(mostUsedLanguages, rawGHMEta);
                    (0, fs_1.writeFileSync)((0, path_1.join)(process.cwd(), "ghmeta.json"), JSON.stringify(groupedMeta));
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(function (err) {
    console.log(err);
});