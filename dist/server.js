var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// node_modules/property-expr/index.js
var require_property_expr = __commonJS({
  "node_modules/property-expr/index.js"(exports2, module2) {
    "use strict";
    function Cache(maxSize) {
      this._maxSize = maxSize;
      this.clear();
    }
    Cache.prototype.clear = function() {
      this._size = 0;
      this._values = /* @__PURE__ */ Object.create(null);
    };
    Cache.prototype.get = function(key) {
      return this._values[key];
    };
    Cache.prototype.set = function(key, value) {
      this._size >= this._maxSize && this.clear();
      if (!(key in this._values)) this._size++;
      return this._values[key] = value;
    };
    var SPLIT_REGEX = /[^.^\]^[]+|(?=\[\]|\.\.)/g;
    var DIGIT_REGEX = /^\d+$/;
    var LEAD_DIGIT_REGEX = /^\d/;
    var SPEC_CHAR_REGEX = /[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g;
    var CLEAN_QUOTES_REGEX = /^\s*(['"]?)(.*?)(\1)\s*$/;
    var MAX_CACHE_SIZE = 512;
    var pathCache = new Cache(MAX_CACHE_SIZE);
    var setCache = new Cache(MAX_CACHE_SIZE);
    var getCache = new Cache(MAX_CACHE_SIZE);
    module2.exports = {
      Cache,
      split: split2,
      normalizePath: normalizePath2,
      setter: function(path) {
        var parts = normalizePath2(path);
        return setCache.get(path) || setCache.set(path, function setter(obj, value) {
          var index = 0;
          var len = parts.length;
          var data = obj;
          while (index < len - 1) {
            var part = parts[index];
            if (part === "__proto__" || part === "constructor" || part === "prototype") {
              return obj;
            }
            data = data[parts[index++]];
          }
          data[parts[index]] = value;
        });
      },
      getter: function(path, safe) {
        var parts = normalizePath2(path);
        return getCache.get(path) || getCache.set(path, function getter2(data) {
          var index = 0, len = parts.length;
          while (index < len) {
            if (data != null || !safe) data = data[parts[index++]];
            else return;
          }
          return data;
        });
      },
      join: function(segments) {
        return segments.reduce(function(path, part) {
          return path + (isQuoted(part) || DIGIT_REGEX.test(part) ? "[" + part + "]" : (path ? "." : "") + part);
        }, "");
      },
      forEach: function(path, cb, thisArg) {
        forEach2(Array.isArray(path) ? path : split2(path), cb, thisArg);
      }
    };
    function normalizePath2(path) {
      return pathCache.get(path) || pathCache.set(
        path,
        split2(path).map(function(part) {
          return part.replace(CLEAN_QUOTES_REGEX, "$2");
        })
      );
    }
    function split2(path) {
      return path.match(SPLIT_REGEX) || [""];
    }
    function forEach2(parts, iter, thisArg) {
      var len = parts.length, part, idx, isArray, isBracket;
      for (idx = 0; idx < len; idx++) {
        part = parts[idx];
        if (part) {
          if (shouldBeQuoted(part)) {
            part = '"' + part + '"';
          }
          isBracket = isQuoted(part);
          isArray = !isBracket && /^\d+$/.test(part);
          iter.call(thisArg, part, isBracket, isArray, idx, parts);
        }
      }
    }
    function isQuoted(str) {
      return typeof str === "string" && str && ["'", '"'].indexOf(str.charAt(0)) !== -1;
    }
    function hasLeadingNumber(part) {
      return part.match(LEAD_DIGIT_REGEX) && !part.match(DIGIT_REGEX);
    }
    function hasSpecialChars(part) {
      return SPEC_CHAR_REGEX.test(part);
    }
    function shouldBeQuoted(part) {
      return !isQuoted(part) && (hasLeadingNumber(part) || hasSpecialChars(part));
    }
  }
});

// node_modules/tiny-case/index.js
var require_tiny_case = __commonJS({
  "node_modules/tiny-case/index.js"(exports2, module2) {
    var reWords = /[A-Z\xc0-\xd6\xd8-\xde]?[a-z\xdf-\xf6\xf8-\xff]+(?:['’](?:d|ll|m|re|s|t|ve))?(?=[\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000]|[A-Z\xc0-\xd6\xd8-\xde]|$)|(?:[A-Z\xc0-\xd6\xd8-\xde]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])+(?:['’](?:D|LL|M|RE|S|T|VE))?(?=[\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000]|[A-Z\xc0-\xd6\xd8-\xde](?:[a-z\xdf-\xf6\xf8-\xff]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])|$)|[A-Z\xc0-\xd6\xd8-\xde]?(?:[a-z\xdf-\xf6\xf8-\xff]|[^\ud800-\udfff\xac\xb1\xd7\xf7\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\xbf\u2000-\u206f \t\x0b\f\xa0\ufeff\n\r\u2028\u2029\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\d+\u2700-\u27bfa-z\xdf-\xf6\xf8-\xffA-Z\xc0-\xd6\xd8-\xde])+(?:['’](?:d|ll|m|re|s|t|ve))?|[A-Z\xc0-\xd6\xd8-\xde]+(?:['’](?:D|LL|M|RE|S|T|VE))?|\d*(?:1ST|2ND|3RD|(?![123])\dTH)(?=\b|[a-z_])|\d*(?:1st|2nd|3rd|(?![123])\dth)(?=\b|[A-Z_])|\d+|(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe2f\u20d0-\u20ff]|\ud83c[\udffb-\udfff])?)*/g;
    var words = (str) => str.match(reWords) || [];
    var upperFirst = (str) => str[0].toUpperCase() + str.slice(1);
    var join2 = (str, d) => words(str).join(d).toLowerCase();
    var camelCase2 = (str) => words(str).reduce(
      (acc, next) => `${acc}${!acc ? next.toLowerCase() : next[0].toUpperCase() + next.slice(1).toLowerCase()}`,
      ""
    );
    var pascalCase = (str) => upperFirst(camelCase2(str));
    var snakeCase2 = (str) => join2(str, "_");
    var kebabCase = (str) => join2(str, "-");
    var sentenceCase = (str) => upperFirst(join2(str, " "));
    var titleCase = (str) => words(str).map(upperFirst).join(" ");
    module2.exports = {
      words,
      upperFirst,
      camelCase: camelCase2,
      pascalCase,
      snakeCase: snakeCase2,
      kebabCase,
      sentenceCase,
      titleCase
    };
  }
});

// node_modules/toposort/index.js
var require_toposort = __commonJS({
  "node_modules/toposort/index.js"(exports2, module2) {
    module2.exports = function(edges) {
      return toposort2(uniqueNodes(edges), edges);
    };
    module2.exports.array = toposort2;
    function toposort2(nodes, edges) {
      var cursor = nodes.length, sorted = new Array(cursor), visited = {}, i = cursor, outgoingEdges = makeOutgoingEdges(edges), nodesHash = makeNodesHash(nodes);
      edges.forEach(function(edge) {
        if (!nodesHash.has(edge[0]) || !nodesHash.has(edge[1])) {
          throw new Error("Unknown node. There is an unknown node in the supplied edges.");
        }
      });
      while (i--) {
        if (!visited[i]) visit(nodes[i], i, /* @__PURE__ */ new Set());
      }
      return sorted;
      function visit(node, i2, predecessors) {
        if (predecessors.has(node)) {
          var nodeRep;
          try {
            nodeRep = ", node was:" + JSON.stringify(node);
          } catch (e) {
            nodeRep = "";
          }
          throw new Error("Cyclic dependency" + nodeRep);
        }
        if (!nodesHash.has(node)) {
          throw new Error("Found unknown node. Make sure to provided all involved nodes. Unknown node: " + JSON.stringify(node));
        }
        if (visited[i2]) return;
        visited[i2] = true;
        var outgoing = outgoingEdges.get(node) || /* @__PURE__ */ new Set();
        outgoing = Array.from(outgoing);
        if (i2 = outgoing.length) {
          predecessors.add(node);
          do {
            var child = outgoing[--i2];
            visit(child, nodesHash.get(child), predecessors);
          } while (i2);
          predecessors.delete(node);
        }
        sorted[--cursor] = node;
      }
    }
    function uniqueNodes(arr) {
      var res = /* @__PURE__ */ new Set();
      for (var i = 0, len = arr.length; i < len; i++) {
        var edge = arr[i];
        res.add(edge[0]);
        res.add(edge[1]);
      }
      return Array.from(res);
    }
    function makeOutgoingEdges(arr) {
      var edges = /* @__PURE__ */ new Map();
      for (var i = 0, len = arr.length; i < len; i++) {
        var edge = arr[i];
        if (!edges.has(edge[0])) edges.set(edge[0], /* @__PURE__ */ new Set());
        if (!edges.has(edge[1])) edges.set(edge[1], /* @__PURE__ */ new Set());
        edges.get(edge[0]).add(edge[1]);
      }
      return edges;
    }
    function makeNodesHash(arr) {
      var res = /* @__PURE__ */ new Map();
      for (var i = 0, len = arr.length; i < len; i++) {
        res.set(arr[i], i);
      }
      return res;
    }
  }
});

// src/main/app.ts
var import_express5 = __toESM(require("express"));
var import_cors = __toESM(require("cors"));
var import_morgan = __toESM(require("morgan"));

// src/interfaces/middlewares/errorHandler.ts
var errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong", error: err.message });
};

// src/interfaces/middlewares/authMiddleware.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var dotenv = __toESM(require("dotenv"));

// src/infrastructure/database/models/User.ts
var import_mongoose = require("mongoose");
var userSchema = new import_mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  blocked: { type: Boolean, default: false },
  // isVerified: { type: Boolean, default: false },
  profilePicture: { type: String },
  // Optional field for profile picture URL
  createdAt: { type: Date, default: Date.now },
  // Default to current date/time
  updatedAt: { type: Date, default: Date.now },
  // Default to current date/time
  role: { type: String, enum: ["user", "teacher", "admin"], default: "user" }
  // Add other fields as needed
});
var User = (0, import_mongoose.model)("User", userSchema);

// src/application/repositories/userRepository.ts
var findByEmail = (email) => __async(void 0, null, function* () {
  return yield User.findOne({ email }).exec();
});
var create = (userData) => __async(void 0, null, function* () {
  const existingUser = yield User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error("User already exists");
  }
  const user = new User(userData);
  return yield user.save();
});
var findById = (id) => __async(void 0, null, function* () {
  return yield User.findById(id).exec();
});
var update = (id, changes) => __async(void 0, null, function* () {
  try {
    const updatedUser = yield User.findByIdAndUpdate(
      id,
      __spreadProps(__spreadValues({}, changes), { updatedAt: /* @__PURE__ */ new Date() }),
      { new: true, runValidators: true }
      // `new: true` returns the updated document, `runValidators: true` validates the update
    ).exec();
    return updatedUser;
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    throw new Error("Failed to update user");
  }
});
var updateViaEmail = (email, changes) => __async(void 0, null, function* () {
  changes.updatedAt = /* @__PURE__ */ new Date();
  return yield User.findOneAndUpdate({ email }, changes, { new: true }).exec();
});
var getAllUsers = () => __async(void 0, null, function* () {
  const users = yield User.find({}, "_id email name isAdmin blocked profilePicture").exec();
  return users.map((user) => ({
    _id: user._id,
    email: user.email,
    name: user.name,
    isAdmin: user.isAdmin,
    blocked: user.blocked,
    profilePicture: user.profilePicture
  }));
});
var blockUser = (email) => __async(void 0, null, function* () {
  yield User.findOneAndUpdate({ email }, { blocked: true }, { new: true }).exec();
});
var unblockUser = (email) => __async(void 0, null, function* () {
  yield User.findOneAndUpdate({ email }, { blocked: false }, { new: true }).exec();
});
var updateUserRole = (userId, role) => __async(void 0, null, function* () {
  return yield User.findByIdAndUpdate(userId, { role }, { new: true });
});
var userRepository = {
  findByEmail,
  create,
  findById,
  update,
  getAllUsers,
  blockUser,
  unblockUser,
  updateViaEmail,
  updateUserRole
  // Add other repository methods as needed
};

// src/interfaces/middlewares/authMiddleware.ts
dotenv.config();
var authMiddleware = (req, res, next) => __async(void 0, null, function* () {
  var _a;
  const token = (_a = req.header("Authorization")) == null ? void 0 : _a.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  try {
    const decoded = import_jsonwebtoken.default.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    const user = yield userRepository.findById(req.user.id);
    if (user == null ? void 0 : user.blocked) {
      return res.status(403).json({ message: "User is blocked" });
    }
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid", error: err.message });
  }
});

// src/interfaces/routes/authenticationRoutes.ts
var import_express = require("express");

// src/application/services/authService.ts
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"));
var import_bcryptjs = __toESM(require("bcryptjs"));

// src/main/redisClient.ts
var import_redis = require("redis");
var redisClient = (0, import_redis.createClient)({
  socket: {
    host: "localhost",
    // Redis server host
    port: 6379
    // Redis server port
  }
});
redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

// src/application/services/authService.ts
var JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
var ACCESS_TOKEN_EXPIRY = "15h";
var REFRESH_TOKEN_EXPIRY = "7d";
var authService = {
  hashPassword: (password) => __async(void 0, null, function* () {
    const salt = yield import_bcryptjs.default.genSalt(10);
    return import_bcryptjs.default.hash(password, salt);
  }),
  verifyPassword: (password, hashedPassword) => __async(void 0, null, function* () {
    return yield import_bcryptjs.default.compare(password, hashedPassword);
  }),
  generateTokens: (user) => __async(void 0, null, function* () {
    const accessToken = import_jsonwebtoken2.default.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
    const refreshToken2 = import_jsonwebtoken2.default.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
    yield authService.storeRefreshToken(user.id, refreshToken2);
    return { accessToken, refreshToken: refreshToken2 };
  }),
  verifyToken: (token) => {
    return import_jsonwebtoken2.default.verify(token, JWT_SECRET);
  },
  storeRefreshToken: (userId, refreshToken2) => __async(void 0, null, function* () {
    yield redisClient.set(userId, refreshToken2, { EX: 7 * 24 * 60 * 60 });
  }),
  refreshToken: (refreshToken2) => __async(void 0, null, function* () {
    try {
      const decoded = import_jsonwebtoken2.default.verify(refreshToken2, JWT_SECRET);
      const storedToken = yield redisClient.get(decoded.id);
      if (storedToken !== refreshToken2) {
        throw new Error("Invalid refresh token");
      }
      const accessToken = import_jsonwebtoken2.default.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
      const newRefreshToken = import_jsonwebtoken2.default.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
      yield authService.storeRefreshToken(decoded.id, newRefreshToken);
      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      return null;
    }
  }),
  removeRefreshToken: (userId) => __async(void 0, null, function* () {
    yield redisClient.del(userId);
  })
};

// src/application/use-cases/authentication/loginUser.ts
var loginUser = (_0) => __async(void 0, [_0], function* ({ email, password }) {
  const user = yield userRepository.findByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }
  if (user.blocked) {
    throw new Error("User is blocked");
  }
  if (!(yield authService.verifyPassword(password, user.password))) {
    throw new Error("Invalid email or password");
  }
  const tokens = yield authService.generateTokens(user);
  const userData = {
    name: user.name,
    email: user.email,
    role: user.role,
    profilePicture: user.profilePicture || ""
    // Provide an empty string if profilePicture is not set
  };
  return { tokens, userData };
});
var userExists = (email) => __async(void 0, null, function* () {
  console.log("email", email);
  const user = yield userRepository.findByEmail(email);
  if (user) {
    return true;
  } else false;
});
var loginAdmin = (_0) => __async(void 0, [_0], function* ({ email, password }) {
  const user = yield userRepository.findByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }
  if (!user || !user.isAdmin) {
    throw new Error("Invalid credentials");
  }
  if (!(yield authService.verifyPassword(password, user.password))) {
    throw new Error("Invalid email or password");
  }
  const tokens = yield authService.generateTokens(user);
  return { user, tokens };
});

// src/application/use-cases/authentication/logoutUser.ts
var logoutUser = (user) => {
};

// src/application/use-cases/authentication/otpService.ts
var import_nodemailer = __toESM(require("nodemailer"));
var transporter = import_nodemailer.default.createTransport({
  service: "gmail",
  // Use your email service provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
var generateOTP = () => {
  return Math.floor(1e5 + Math.random() * 9e5).toString();
};
var sendOTPEmail = (email, otp) => __async(void 0, null, function* () {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verification OTP for Virtual Classroom",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #333;">Virtual Classroom Verification OTP</h2>
        <p style="font-size: 16px;">Dear Student,</p>
        <p style="font-size: 16px;">Your OTP for verification is: <strong>${otp}</strong></p>
        <p style="font-size: 16px;">Please use this OTP to verify your identity and proceed with accessing the virtual classroom.</p>
        <p style="font-size: 16px;">If you did not request this OTP, please ignore this email.</p>
        <p style="font-size: 16px;">Thank you,</p>
        <p style="font-size: 16px;">Virtual Classroom Team</p>
      </div>
    `
  };
  yield transporter.sendMail(mailOptions);
  console.log(`OTP sent successfully to ${email}`);
});
var otpService = {
  sendAndStoreOTP(email) {
    return __async(this, null, function* () {
      const otp = generateOTP();
      try {
        yield sendOTPEmail(email, otp);
        const otpKey = `otp:${email}`;
        yield redisClient.set(otpKey, otp, { EX: 150 });
        console.log("OTP stored successfully in Redis");
        console.log("OTP:", otp);
      } catch (error) {
        console.error("Error sending/storing OTP:", error);
        throw new Error("Failed to send/store OTP");
      }
    });
  },
  verifyOTP(email, otp) {
    return __async(this, null, function* () {
      const otpKey = `otp:${email}`;
      try {
        const cachedOTP = yield redisClient.get(otpKey);
        console.log("Cached OTP:", cachedOTP);
        if (cachedOTP === otp) {
          yield redisClient.del(otpKey);
          return true;
        } else {
          return false;
        }
      } catch (err) {
        console.error("Redis get error:", err);
        return false;
      }
    });
  }
};

// src/application/use-cases/authentication/registerUser.ts
var validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
var validatePassword = (password) => {
  return password.length >= 6 && password.length <= 50;
};
var validateName = (name) => {
  return name.length >= 3 && name.length <= 50;
};
var registerUser = (_0) => __async(void 0, [_0], function* ({ email, password, name, otp }) {
  const hashedPassword = yield authService.hashPassword(password);
  if (!validateEmail(email)) {
    throw new Error("Invalid email format");
  }
  if (!validatePassword(password)) {
    throw new Error("Password must be at least 6 characters long");
  }
  if (!validateName(name)) {
    throw new Error("Name must be at least 3 characters long");
  }
  let valiateOTP = yield otpService.verifyOTP(email, otp);
  if (!valiateOTP) {
    throw new Error("Invalid OTP");
  }
  const user = yield userRepository.create({ email, password: hashedPassword, name });
  const tokens = yield authService.generateTokens(user);
  const userData = {
    name: user.name,
    email: user.email,
    role: user.role,
    profilePicture: user.profilePicture || ""
    // Provide an empty string if profilePicture is not set
  };
  return { tokens, userData };
});
var forgotPassword = (_0) => __async(void 0, [_0], function* ({ email, password, otp }) {
  console.log(email, password, otp);
  if (!validateEmail(email)) {
    throw new Error("Invalid email format");
  }
  if (!validatePassword(password)) {
    throw new Error("Password must be at least 6 characters long");
  }
  let valiateOTP = yield otpService.verifyOTP(email, otp);
  console.log("valiateOTP", valiateOTP);
  if (!valiateOTP) {
    throw new Error("Invalid OTP");
  }
  const userdata = yield userRepository.findByEmail(email);
  if (!userdata) {
    throw new Error("User not found");
  }
  const hashedPassword = yield authService.hashPassword(password);
  const updatedUser = yield userRepository.update(userdata._id.toString(), { password: hashedPassword });
  if (!updatedUser) {
    throw new Error("Failed to update user try again later");
  }
  const tokens = yield authService.generateTokens(updatedUser);
  return { tokens };
});
var googleLogin = (_0) => __async(void 0, [_0], function* ({ email, name, googleId, profilePicture }) {
  let user = yield userRepository.findByEmail(email);
  if (!user) {
    const hashedPassword = yield authService.hashPassword(googleId);
    user = yield userRepository.create({
      email,
      password: hashedPassword,
      name: name || "Unknown",
      profilePicture
    });
  }
  const tokens = yield authService.generateTokens(user);
  return tokens;
});

// src/interfaces/controllers/authenticationController.ts
var registerUser2 = (req, res) => __async(void 0, null, function* () {
  try {
    const result = yield registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
var loginUser2 = (req, res) => __async(void 0, null, function* () {
  try {
    const result = yield loginUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
var loginAdmin2 = (req, res) => __async(void 0, null, function* () {
  try {
    const result = yield loginAdmin(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
var logoutUser2 = (req, res) => {
  try {
    logoutUser(req.user);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
var validateEmail2 = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
var sendOTP = (req, res) => __async(void 0, null, function* () {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!validateEmail2(email)) {
      throw new Error("Invalid email format");
    }
    const userAlreadyExists = yield userExists(email);
    if (userAlreadyExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    yield otpService.sendAndStoreOTP(email);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
var resendOTP = (req, res) => __async(void 0, null, function* () {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!validateEmail2(email)) {
      throw new Error("Invalid email format");
    }
    const userAlreadyExists = yield userExists(email);
    if (userAlreadyExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    yield otpService.sendAndStoreOTP(email);
    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
var forgotPasswordOTP = (req, res) => __async(void 0, null, function* () {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  try {
    if (!validateEmail2(email)) {
      throw new Error("Invalid email format");
    }
    const userNotExists = yield userExists(email);
    if (!userNotExists) {
      return res.status(400).json({ message: "User Not exists" });
    }
    yield otpService.sendAndStoreOTP(email);
    return res.status(200).json({ message: "Reset Password OTP sent to your email address." });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while processing your request." });
  }
});
var forgotPassword2 = (req, res) => __async(void 0, null, function* () {
  const { email, password, otp } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  try {
    const result = yield forgotPassword({ email, password, otp });
    return res.status(200).json({ message: "Password reset successfully", tokens: result.tokens });
  } catch (error) {
    return res.status(500).json({ message: error.message || "An error occurred while processing your request." });
  }
});
var refreshToken = (req, res) => __async(void 0, null, function* () {
  const { refreshToken: refreshToken2 } = req.body;
  const newTokens = yield authService.refreshToken(refreshToken2);
  if (!newTokens) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
  res.json(newTokens);
});

// src/interfaces/controllers/googleAuth.ts
var import_google_auth_library = require("google-auth-library");
var import_googleapis = require("googleapis");
var oauth2Client = new import_google_auth_library.OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:5173"
);
var googleAuthCallback = (req, res) => __async(void 0, null, function* () {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const { code } = req.body;
  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Authorization code is missing" });
  }
  try {
    const { tokens } = yield oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    const people = import_googleapis.google.people({ version: "v1", auth: oauth2Client });
    const response = yield people.people.get({
      resourceName: "people/me",
      personFields: "names,emailAddresses,photos"
    });
    const userInfo = response.data;
    const email = ((_b = (_a = userInfo.emailAddresses) == null ? void 0 : _a[0]) == null ? void 0 : _b.value) || "";
    const name = ((_d = (_c = userInfo.names) == null ? void 0 : _c[0]) == null ? void 0 : _d.displayName) || "No name";
    const googleId = (_f = (_e = userInfo.resourceName) == null ? void 0 : _e.split("/")[1]) != null ? _f : "";
    console.log("google id", googleId);
    const profilePicture = ((_h = (_g = userInfo.photos) == null ? void 0 : _g[0]) == null ? void 0 : _h.url) || "No profile picture";
    const googleTokens = yield googleLogin({ email, name, googleId, profilePicture });
    res.json({
      success: true,
      token: googleTokens,
      user: {
        name,
        email,
        profilePicture
      }
    });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
});

// src/interfaces/routes/authenticationRoutes.ts
var router = (0, import_express.Router)();
router.post("/register", registerUser2);
router.post("/login", loginUser2);
router.post("/logout", logoutUser2);
router.post("/send-otp", sendOTP);
router.post("/resend-otp", resendOTP);
router.post("/forgot-passwordOTP", forgotPasswordOTP);
router.post("/forgot-password", forgotPassword2);
router.post("/refresh-token", refreshToken);
router.post("/google/callback", googleAuthCallback);
router.post("/adminlogin", loginAdmin2);
router.get("/test", (req, res) => {
  res.send("Hello, testing route!");
});
var authenticationRoutes_default = router;

// src/interfaces/routes/profileRoutes.ts
var import_express2 = require("express");

// src/application/use-cases/profile/viewProfile.ts
var viewProfile = (user) => __async(void 0, null, function* () {
  return userRepository.findById(user.id);
});

// src/application/use-cases/profile/editProfile.ts
var editProfile = (user, changes) => __async(void 0, null, function* () {
  return userRepository.update(user.id, changes);
});
var changePassword = (userId, currentPassword, newPassword) => __async(void 0, null, function* () {
  try {
    const user = yield userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordValid = yield authService.verifyPassword(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid current password");
    }
    const hashedNewPassword = yield authService.hashPassword(newPassword);
    user.password = hashedNewPassword;
    yield userRepository.update(user.id, { password: hashedNewPassword });
    return { success: true };
  } catch (error) {
    throw new Error(`Failed to change password: ${error.message}`);
  }
});

// src/interfaces/controllers/profileController.ts
var viewProfile2 = (req, res) => __async(void 0, null, function* () {
  var _a, _b, _c, _d;
  try {
    const profile = yield viewProfile(req.user);
    const profileDTO = {
      name: (_a = profile == null ? void 0 : profile.name) != null ? _a : "",
      email: (_b = profile == null ? void 0 : profile.email) != null ? _b : "",
      role: (_c = profile == null ? void 0 : profile.role) != null ? _c : "",
      profilePicture: (_d = profile == null ? void 0 : profile.profilePicture) != null ? _d : ""
      // phone: profile?.phone ?? '',
    };
    res.status(200).json(profileDTO);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
var editProfile2 = (req, res) => __async(void 0, null, function* () {
  var _a, _b, _c, _d;
  try {
    const updatedProfile = yield editProfile(req.user, req.body);
    const profileDTO = {
      name: (_a = updatedProfile == null ? void 0 : updatedProfile.name) != null ? _a : "",
      email: (_b = updatedProfile == null ? void 0 : updatedProfile.email) != null ? _b : "",
      role: (_c = updatedProfile == null ? void 0 : updatedProfile.role) != null ? _c : "",
      profilePicture: (_d = updatedProfile == null ? void 0 : updatedProfile.profilePicture) != null ? _d : ""
      // phone: profile?.phone ?? '',
    };
    res.status(200).json({ data: profileDTO });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
var changePassword2 = (req, res) => __async(void 0, null, function* () {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;
    const result = yield changePassword(user.id, currentPassword, newPassword);
    if (result.success) {
      res.status(200).json({ message: "Password changed successfully" });
    } else {
      res.status(400).json({ message: "Failed to change password" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// src/infrastructure/database/models/TeacherRequest.ts
var import_mongoose2 = __toESM(require("mongoose"));
var TeacherRequestSchema = new import_mongoose2.Schema({
  userId: { type: String, required: true },
  // Use String
  highestQualification: { type: String, required: true },
  yearsOfTeachingExperience: { type: Number, required: true },
  subjects: [{ type: String, required: true }],
  bio: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
}, { timestamps: true });
var TeacherRequest = import_mongoose2.default.model("TeacherRequest", TeacherRequestSchema);
var TeacherRequest_default = TeacherRequest;

// src/application/repositories/teacherRepository.ts
var createTeacherRequest = (data) => __async(void 0, null, function* () {
  const newRequest = new TeacherRequest_default(data);
  return yield newRequest.save();
});
var findOne = (query) => __async(void 0, null, function* () {
  try {
    return yield TeacherRequest_default.findOne(query).populate("userId", "name email");
  } catch (error) {
    console.error("Error finding teacher request:", error);
    throw new Error("Error finding teacher request");
  }
});
var getAllTeacherRequests = () => __async(void 0, null, function* () {
  try {
    const teacherRequests = yield TeacherRequest_default.aggregate([
      {
        $addFields: {
          userId: { $toObjectId: "$userId" }
        }
      },
      {
        $lookup: {
          from: "users",
          // Collection name
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          highestQualification: 1,
          yearsOfTeachingExperience: 1,
          subjects: 1,
          bio: 1,
          status: 1,
          "user.name": 1,
          "user.email": 1
        }
      }
    ]);
    return teacherRequests;
  } catch (error) {
    console.error("Error fetching teacher requests:", error);
    throw error;
  }
});
var getTeacherRequestById = (id) => __async(void 0, null, function* () {
  return yield TeacherRequest_default.findById(id).populate("userId", "name email");
});
var updateTeacherRequestStatus = (id, status) => __async(void 0, null, function* () {
  return yield TeacherRequest_default.findByIdAndUpdate(id, { status }, { new: true });
});
var deleteTeacherRequest = (id) => __async(void 0, null, function* () {
  return yield TeacherRequest_default.findByIdAndDelete(id);
});

// node_modules/yup/index.esm.js
var import_property_expr = __toESM(require_property_expr());
var import_tiny_case = __toESM(require_tiny_case());
var import_toposort = __toESM(require_toposort());
var toString = Object.prototype.toString;
var errorToString = Error.prototype.toString;
var regExpToString = RegExp.prototype.toString;
var symbolToString = typeof Symbol !== "undefined" ? Symbol.prototype.toString : () => "";
var SYMBOL_REGEXP = /^Symbol\((.*)\)(.*)$/;
function printNumber(val) {
  if (val != +val) return "NaN";
  const isNegativeZero = val === 0 && 1 / val < 0;
  return isNegativeZero ? "-0" : "" + val;
}
function printSimpleValue(val, quoteStrings = false) {
  if (val == null || val === true || val === false) return "" + val;
  const typeOf = typeof val;
  if (typeOf === "number") return printNumber(val);
  if (typeOf === "string") return quoteStrings ? `"${val}"` : val;
  if (typeOf === "function") return "[Function " + (val.name || "anonymous") + "]";
  if (typeOf === "symbol") return symbolToString.call(val).replace(SYMBOL_REGEXP, "Symbol($1)");
  const tag = toString.call(val).slice(8, -1);
  if (tag === "Date") return isNaN(val.getTime()) ? "" + val : val.toISOString(val);
  if (tag === "Error" || val instanceof Error) return "[" + errorToString.call(val) + "]";
  if (tag === "RegExp") return regExpToString.call(val);
  return null;
}
function printValue(value, quoteStrings) {
  let result = printSimpleValue(value, quoteStrings);
  if (result !== null) return result;
  return JSON.stringify(value, function(key, value2) {
    let result2 = printSimpleValue(this[key], quoteStrings);
    if (result2 !== null) return result2;
    return value2;
  }, 2);
}
function toArray(value) {
  return value == null ? [] : [].concat(value);
}
var _Symbol$toStringTag;
var _Symbol$hasInstance;
var _Symbol$toStringTag2;
var strReg = /\$\{\s*(\w+)\s*\}/g;
_Symbol$toStringTag = Symbol.toStringTag;
var ValidationErrorNoStack = class {
  constructor(errorOrErrors, value, field, type) {
    this.name = void 0;
    this.message = void 0;
    this.value = void 0;
    this.path = void 0;
    this.type = void 0;
    this.params = void 0;
    this.errors = void 0;
    this.inner = void 0;
    this[_Symbol$toStringTag] = "Error";
    this.name = "ValidationError";
    this.value = value;
    this.path = field;
    this.type = type;
    this.errors = [];
    this.inner = [];
    toArray(errorOrErrors).forEach((err) => {
      if (ValidationError.isError(err)) {
        this.errors.push(...err.errors);
        const innerErrors = err.inner.length ? err.inner : [err];
        this.inner.push(...innerErrors);
      } else {
        this.errors.push(err);
      }
    });
    this.message = this.errors.length > 1 ? `${this.errors.length} errors occurred` : this.errors[0];
  }
};
_Symbol$hasInstance = Symbol.hasInstance;
_Symbol$toStringTag2 = Symbol.toStringTag;
var ValidationError = class _ValidationError extends Error {
  static formatError(message, params) {
    const path = params.label || params.path || "this";
    if (path !== params.path) params = Object.assign({}, params, {
      path
    });
    if (typeof message === "string") return message.replace(strReg, (_, key) => printValue(params[key]));
    if (typeof message === "function") return message(params);
    return message;
  }
  static isError(err) {
    return err && err.name === "ValidationError";
  }
  constructor(errorOrErrors, value, field, type, disableStack) {
    const errorNoStack = new ValidationErrorNoStack(errorOrErrors, value, field, type);
    if (disableStack) {
      return errorNoStack;
    }
    super();
    this.value = void 0;
    this.path = void 0;
    this.type = void 0;
    this.params = void 0;
    this.errors = [];
    this.inner = [];
    this[_Symbol$toStringTag2] = "Error";
    this.name = errorNoStack.name;
    this.message = errorNoStack.message;
    this.type = errorNoStack.type;
    this.value = errorNoStack.value;
    this.path = errorNoStack.path;
    this.errors = errorNoStack.errors;
    this.inner = errorNoStack.inner;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, _ValidationError);
    }
  }
  static [_Symbol$hasInstance](inst) {
    return ValidationErrorNoStack[Symbol.hasInstance](inst) || super[Symbol.hasInstance](inst);
  }
};
var mixed = {
  default: "${path} is invalid",
  required: "${path} is a required field",
  defined: "${path} must be defined",
  notNull: "${path} cannot be null",
  oneOf: "${path} must be one of the following values: ${values}",
  notOneOf: "${path} must not be one of the following values: ${values}",
  notType: ({
    path,
    type,
    value,
    originalValue
  }) => {
    const castMsg = originalValue != null && originalValue !== value ? ` (cast from the value \`${printValue(originalValue, true)}\`).` : ".";
    return type !== "mixed" ? `${path} must be a \`${type}\` type, but the final value was: \`${printValue(value, true)}\`` + castMsg : `${path} must match the configured type. The validated value was: \`${printValue(value, true)}\`` + castMsg;
  }
};
var string = {
  length: "${path} must be exactly ${length} characters",
  min: "${path} must be at least ${min} characters",
  max: "${path} must be at most ${max} characters",
  matches: '${path} must match the following: "${regex}"',
  email: "${path} must be a valid email",
  url: "${path} must be a valid URL",
  uuid: "${path} must be a valid UUID",
  datetime: "${path} must be a valid ISO date-time",
  datetime_precision: "${path} must be a valid ISO date-time with a sub-second precision of exactly ${precision} digits",
  datetime_offset: '${path} must be a valid ISO date-time with UTC "Z" timezone',
  trim: "${path} must be a trimmed string",
  lowercase: "${path} must be a lowercase string",
  uppercase: "${path} must be a upper case string"
};
var number = {
  min: "${path} must be greater than or equal to ${min}",
  max: "${path} must be less than or equal to ${max}",
  lessThan: "${path} must be less than ${less}",
  moreThan: "${path} must be greater than ${more}",
  positive: "${path} must be a positive number",
  negative: "${path} must be a negative number",
  integer: "${path} must be an integer"
};
var date = {
  min: "${path} field must be later than ${min}",
  max: "${path} field must be at earlier than ${max}"
};
var boolean = {
  isValue: "${path} field must be ${value}"
};
var object = {
  noUnknown: "${path} field has unspecified keys: ${unknown}"
};
var array = {
  min: "${path} field must have at least ${min} items",
  max: "${path} field must have less than or equal to ${max} items",
  length: "${path} must have ${length} items"
};
var tuple = {
  notType: (params) => {
    const {
      path,
      value,
      spec
    } = params;
    const typeLen = spec.types.length;
    if (Array.isArray(value)) {
      if (value.length < typeLen) return `${path} tuple value has too few items, expected a length of ${typeLen} but got ${value.length} for value: \`${printValue(value, true)}\``;
      if (value.length > typeLen) return `${path} tuple value has too many items, expected a length of ${typeLen} but got ${value.length} for value: \`${printValue(value, true)}\``;
    }
    return ValidationError.formatError(mixed.notType, params);
  }
};
var locale = Object.assign(/* @__PURE__ */ Object.create(null), {
  mixed,
  string,
  number,
  date,
  object,
  array,
  boolean,
  tuple
});
var isSchema = (obj) => obj && obj.__isYupSchema__;
var Condition = class _Condition {
  static fromOptions(refs, config6) {
    if (!config6.then && !config6.otherwise) throw new TypeError("either `then:` or `otherwise:` is required for `when()` conditions");
    let {
      is,
      then,
      otherwise
    } = config6;
    let check = typeof is === "function" ? is : (...values) => values.every((value) => value === is);
    return new _Condition(refs, (values, schema) => {
      var _branch;
      let branch = check(...values) ? then : otherwise;
      return (_branch = branch == null ? void 0 : branch(schema)) != null ? _branch : schema;
    });
  }
  constructor(refs, builder) {
    this.fn = void 0;
    this.refs = refs;
    this.refs = refs;
    this.fn = builder;
  }
  resolve(base, options) {
    let values = this.refs.map((ref) => (
      // TODO: ? operator here?
      ref.getValue(options == null ? void 0 : options.value, options == null ? void 0 : options.parent, options == null ? void 0 : options.context)
    ));
    let schema = this.fn(values, base, options);
    if (schema === void 0 || // @ts-ignore this can be base
    schema === base) {
      return base;
    }
    if (!isSchema(schema)) throw new TypeError("conditions must return a schema object");
    return schema.resolve(options);
  }
};
var prefixes = {
  context: "$",
  value: "."
};
var Reference = class {
  constructor(key, options = {}) {
    this.key = void 0;
    this.isContext = void 0;
    this.isValue = void 0;
    this.isSibling = void 0;
    this.path = void 0;
    this.getter = void 0;
    this.map = void 0;
    if (typeof key !== "string") throw new TypeError("ref must be a string, got: " + key);
    this.key = key.trim();
    if (key === "") throw new TypeError("ref must be a non-empty string");
    this.isContext = this.key[0] === prefixes.context;
    this.isValue = this.key[0] === prefixes.value;
    this.isSibling = !this.isContext && !this.isValue;
    let prefix = this.isContext ? prefixes.context : this.isValue ? prefixes.value : "";
    this.path = this.key.slice(prefix.length);
    this.getter = this.path && (0, import_property_expr.getter)(this.path, true);
    this.map = options.map;
  }
  getValue(value, parent, context) {
    let result = this.isContext ? context : this.isValue ? value : parent;
    if (this.getter) result = this.getter(result || {});
    if (this.map) result = this.map(result);
    return result;
  }
  /**
   *
   * @param {*} value
   * @param {Object} options
   * @param {Object=} options.context
   * @param {Object=} options.parent
   */
  cast(value, options) {
    return this.getValue(value, options == null ? void 0 : options.parent, options == null ? void 0 : options.context);
  }
  resolve() {
    return this;
  }
  describe() {
    return {
      type: "ref",
      key: this.key
    };
  }
  toString() {
    return `Ref(${this.key})`;
  }
  static isRef(value) {
    return value && value.__isYupRef;
  }
};
Reference.prototype.__isYupRef = true;
var isAbsent = (value) => value == null;
function createValidation(config6) {
  function validate({
    value,
    path = "",
    options,
    originalValue,
    schema
  }, panic, next) {
    const {
      name,
      test,
      params,
      message,
      skipAbsent
    } = config6;
    let {
      parent,
      context,
      abortEarly = schema.spec.abortEarly,
      disableStackTrace = schema.spec.disableStackTrace
    } = options;
    function resolve(item) {
      return Reference.isRef(item) ? item.getValue(value, parent, context) : item;
    }
    function createError(overrides = {}) {
      const nextParams = Object.assign({
        value,
        originalValue,
        label: schema.spec.label,
        path: overrides.path || path,
        spec: schema.spec,
        disableStackTrace: overrides.disableStackTrace || disableStackTrace
      }, params, overrides.params);
      for (const key of Object.keys(nextParams)) nextParams[key] = resolve(nextParams[key]);
      const error = new ValidationError(ValidationError.formatError(overrides.message || message, nextParams), value, nextParams.path, overrides.type || name, nextParams.disableStackTrace);
      error.params = nextParams;
      return error;
    }
    const invalid = abortEarly ? panic : next;
    let ctx = {
      path,
      parent,
      type: name,
      from: options.from,
      createError,
      resolve,
      options,
      originalValue,
      schema
    };
    const handleResult = (validOrError) => {
      if (ValidationError.isError(validOrError)) invalid(validOrError);
      else if (!validOrError) invalid(createError());
      else next(null);
    };
    const handleError = (err) => {
      if (ValidationError.isError(err)) invalid(err);
      else panic(err);
    };
    const shouldSkip = skipAbsent && isAbsent(value);
    if (shouldSkip) {
      return handleResult(true);
    }
    let result;
    try {
      var _result;
      result = test.call(ctx, value, ctx);
      if (typeof ((_result = result) == null ? void 0 : _result.then) === "function") {
        if (options.sync) {
          throw new Error(`Validation test of type: "${ctx.type}" returned a Promise during a synchronous validate. This test will finish after the validate call has returned`);
        }
        return Promise.resolve(result).then(handleResult, handleError);
      }
    } catch (err) {
      handleError(err);
      return;
    }
    handleResult(result);
  }
  validate.OPTIONS = config6;
  return validate;
}
function getIn(schema, path, value, context = value) {
  let parent, lastPart, lastPartDebug;
  if (!path) return {
    parent,
    parentPath: path,
    schema
  };
  (0, import_property_expr.forEach)(path, (_part, isBracket, isArray) => {
    let part = isBracket ? _part.slice(1, _part.length - 1) : _part;
    schema = schema.resolve({
      context,
      parent,
      value
    });
    let isTuple = schema.type === "tuple";
    let idx = isArray ? parseInt(part, 10) : 0;
    if (schema.innerType || isTuple) {
      if (isTuple && !isArray) throw new Error(`Yup.reach cannot implicitly index into a tuple type. the path part "${lastPartDebug}" must contain an index to the tuple element, e.g. "${lastPartDebug}[0]"`);
      if (value && idx >= value.length) {
        throw new Error(`Yup.reach cannot resolve an array item at index: ${_part}, in the path: ${path}. because there is no value at that index. `);
      }
      parent = value;
      value = value && value[idx];
      schema = isTuple ? schema.spec.types[idx] : schema.innerType;
    }
    if (!isArray) {
      if (!schema.fields || !schema.fields[part]) throw new Error(`The schema does not contain the path: ${path}. (failed at: ${lastPartDebug} which is a type: "${schema.type}")`);
      parent = value;
      value = value && value[part];
      schema = schema.fields[part];
    }
    lastPart = part;
    lastPartDebug = isBracket ? "[" + _part + "]" : "." + _part;
  });
  return {
    schema,
    parent,
    parentPath: lastPart
  };
}
var ReferenceSet = class _ReferenceSet extends Set {
  describe() {
    const description = [];
    for (const item of this.values()) {
      description.push(Reference.isRef(item) ? item.describe() : item);
    }
    return description;
  }
  resolveAll(resolve) {
    let result = [];
    for (const item of this.values()) {
      result.push(resolve(item));
    }
    return result;
  }
  clone() {
    return new _ReferenceSet(this.values());
  }
  merge(newItems, removeItems) {
    const next = this.clone();
    newItems.forEach((value) => next.add(value));
    removeItems.forEach((value) => next.delete(value));
    return next;
  }
};
function clone(src, seen = /* @__PURE__ */ new Map()) {
  if (isSchema(src) || !src || typeof src !== "object") return src;
  if (seen.has(src)) return seen.get(src);
  let copy;
  if (src instanceof Date) {
    copy = new Date(src.getTime());
    seen.set(src, copy);
  } else if (src instanceof RegExp) {
    copy = new RegExp(src);
    seen.set(src, copy);
  } else if (Array.isArray(src)) {
    copy = new Array(src.length);
    seen.set(src, copy);
    for (let i = 0; i < src.length; i++) copy[i] = clone(src[i], seen);
  } else if (src instanceof Map) {
    copy = /* @__PURE__ */ new Map();
    seen.set(src, copy);
    for (const [k, v] of src.entries()) copy.set(k, clone(v, seen));
  } else if (src instanceof Set) {
    copy = /* @__PURE__ */ new Set();
    seen.set(src, copy);
    for (const v of src) copy.add(clone(v, seen));
  } else if (src instanceof Object) {
    copy = {};
    seen.set(src, copy);
    for (const [k, v] of Object.entries(src)) copy[k] = clone(v, seen);
  } else {
    throw Error(`Unable to clone ${src}`);
  }
  return copy;
}
var Schema3 = class {
  constructor(options) {
    this.type = void 0;
    this.deps = [];
    this.tests = void 0;
    this.transforms = void 0;
    this.conditions = [];
    this._mutate = void 0;
    this.internalTests = {};
    this._whitelist = new ReferenceSet();
    this._blacklist = new ReferenceSet();
    this.exclusiveTests = /* @__PURE__ */ Object.create(null);
    this._typeCheck = void 0;
    this.spec = void 0;
    this.tests = [];
    this.transforms = [];
    this.withMutation(() => {
      this.typeError(mixed.notType);
    });
    this.type = options.type;
    this._typeCheck = options.check;
    this.spec = Object.assign({
      strip: false,
      strict: false,
      abortEarly: true,
      recursive: true,
      disableStackTrace: false,
      nullable: false,
      optional: true,
      coerce: true
    }, options == null ? void 0 : options.spec);
    this.withMutation((s) => {
      s.nonNullable();
    });
  }
  // TODO: remove
  get _type() {
    return this.type;
  }
  clone(spec) {
    if (this._mutate) {
      if (spec) Object.assign(this.spec, spec);
      return this;
    }
    const next = Object.create(Object.getPrototypeOf(this));
    next.type = this.type;
    next._typeCheck = this._typeCheck;
    next._whitelist = this._whitelist.clone();
    next._blacklist = this._blacklist.clone();
    next.internalTests = Object.assign({}, this.internalTests);
    next.exclusiveTests = Object.assign({}, this.exclusiveTests);
    next.deps = [...this.deps];
    next.conditions = [...this.conditions];
    next.tests = [...this.tests];
    next.transforms = [...this.transforms];
    next.spec = clone(Object.assign({}, this.spec, spec));
    return next;
  }
  label(label) {
    let next = this.clone();
    next.spec.label = label;
    return next;
  }
  meta(...args) {
    if (args.length === 0) return this.spec.meta;
    let next = this.clone();
    next.spec.meta = Object.assign(next.spec.meta || {}, args[0]);
    return next;
  }
  withMutation(fn) {
    let before = this._mutate;
    this._mutate = true;
    let result = fn(this);
    this._mutate = before;
    return result;
  }
  concat(schema) {
    if (!schema || schema === this) return this;
    if (schema.type !== this.type && this.type !== "mixed") throw new TypeError(`You cannot \`concat()\` schema's of different types: ${this.type} and ${schema.type}`);
    let base = this;
    let combined = schema.clone();
    const mergedSpec = Object.assign({}, base.spec, combined.spec);
    combined.spec = mergedSpec;
    combined.internalTests = Object.assign({}, base.internalTests, combined.internalTests);
    combined._whitelist = base._whitelist.merge(schema._whitelist, schema._blacklist);
    combined._blacklist = base._blacklist.merge(schema._blacklist, schema._whitelist);
    combined.tests = base.tests;
    combined.exclusiveTests = base.exclusiveTests;
    combined.withMutation((next) => {
      schema.tests.forEach((fn) => {
        next.test(fn.OPTIONS);
      });
    });
    combined.transforms = [...base.transforms, ...combined.transforms];
    return combined;
  }
  isType(v) {
    if (v == null) {
      if (this.spec.nullable && v === null) return true;
      if (this.spec.optional && v === void 0) return true;
      return false;
    }
    return this._typeCheck(v);
  }
  resolve(options) {
    let schema = this;
    if (schema.conditions.length) {
      let conditions = schema.conditions;
      schema = schema.clone();
      schema.conditions = [];
      schema = conditions.reduce((prevSchema, condition) => condition.resolve(prevSchema, options), schema);
      schema = schema.resolve(options);
    }
    return schema;
  }
  resolveOptions(options) {
    var _options$strict, _options$abortEarly, _options$recursive, _options$disableStack;
    return Object.assign({}, options, {
      from: options.from || [],
      strict: (_options$strict = options.strict) != null ? _options$strict : this.spec.strict,
      abortEarly: (_options$abortEarly = options.abortEarly) != null ? _options$abortEarly : this.spec.abortEarly,
      recursive: (_options$recursive = options.recursive) != null ? _options$recursive : this.spec.recursive,
      disableStackTrace: (_options$disableStack = options.disableStackTrace) != null ? _options$disableStack : this.spec.disableStackTrace
    });
  }
  /**
   * Run the configured transform pipeline over an input value.
   */
  cast(value, options = {}) {
    let resolvedSchema = this.resolve(Object.assign({
      value
    }, options));
    let allowOptionality = options.assert === "ignore-optionality";
    let result = resolvedSchema._cast(value, options);
    if (options.assert !== false && !resolvedSchema.isType(result)) {
      if (allowOptionality && isAbsent(result)) {
        return result;
      }
      let formattedValue = printValue(value);
      let formattedResult = printValue(result);
      throw new TypeError(`The value of ${options.path || "field"} could not be cast to a value that satisfies the schema type: "${resolvedSchema.type}". 

attempted value: ${formattedValue} 
` + (formattedResult !== formattedValue ? `result of cast: ${formattedResult}` : ""));
    }
    return result;
  }
  _cast(rawValue, options) {
    let value = rawValue === void 0 ? rawValue : this.transforms.reduce((prevValue, fn) => fn.call(this, prevValue, rawValue, this), rawValue);
    if (value === void 0) {
      value = this.getDefault(options);
    }
    return value;
  }
  _validate(_value, options = {}, panic, next) {
    let {
      path,
      originalValue = _value,
      strict = this.spec.strict
    } = options;
    let value = _value;
    if (!strict) {
      value = this._cast(value, Object.assign({
        assert: false
      }, options));
    }
    let initialTests = [];
    for (let test of Object.values(this.internalTests)) {
      if (test) initialTests.push(test);
    }
    this.runTests({
      path,
      value,
      originalValue,
      options,
      tests: initialTests
    }, panic, (initialErrors) => {
      if (initialErrors.length) {
        return next(initialErrors, value);
      }
      this.runTests({
        path,
        value,
        originalValue,
        options,
        tests: this.tests
      }, panic, next);
    });
  }
  /**
   * Executes a set of validations, either schema, produced Tests or a nested
   * schema validate result.
   */
  runTests(runOptions, panic, next) {
    let fired = false;
    let {
      tests,
      value,
      originalValue,
      path,
      options
    } = runOptions;
    let panicOnce = (arg) => {
      if (fired) return;
      fired = true;
      panic(arg, value);
    };
    let nextOnce = (arg) => {
      if (fired) return;
      fired = true;
      next(arg, value);
    };
    let count = tests.length;
    let nestedErrors = [];
    if (!count) return nextOnce([]);
    let args = {
      value,
      originalValue,
      path,
      options,
      schema: this
    };
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      test(args, panicOnce, function finishTestRun(err) {
        if (err) {
          Array.isArray(err) ? nestedErrors.push(...err) : nestedErrors.push(err);
        }
        if (--count <= 0) {
          nextOnce(nestedErrors);
        }
      });
    }
  }
  asNestedTest({
    key,
    index,
    parent,
    parentPath,
    originalParent,
    options
  }) {
    const k = key != null ? key : index;
    if (k == null) {
      throw TypeError("Must include `key` or `index` for nested validations");
    }
    const isIndex = typeof k === "number";
    let value = parent[k];
    const testOptions = Object.assign({}, options, {
      // Nested validations fields are always strict:
      //    1. parent isn't strict so the casting will also have cast inner values
      //    2. parent is strict in which case the nested values weren't cast either
      strict: true,
      parent,
      value,
      originalValue: originalParent[k],
      // FIXME: tests depend on `index` being passed around deeply,
      //   we should not let the options.key/index bleed through
      key: void 0,
      // index: undefined,
      [isIndex ? "index" : "key"]: k,
      path: isIndex || k.includes(".") ? `${parentPath || ""}[${isIndex ? k : `"${k}"`}]` : (parentPath ? `${parentPath}.` : "") + key
    });
    return (_, panic, next) => this.resolve(testOptions)._validate(value, testOptions, panic, next);
  }
  validate(value, options) {
    var _options$disableStack2;
    let schema = this.resolve(Object.assign({}, options, {
      value
    }));
    let disableStackTrace = (_options$disableStack2 = options == null ? void 0 : options.disableStackTrace) != null ? _options$disableStack2 : schema.spec.disableStackTrace;
    return new Promise((resolve, reject) => schema._validate(value, options, (error, parsed) => {
      if (ValidationError.isError(error)) error.value = parsed;
      reject(error);
    }, (errors, validated) => {
      if (errors.length) reject(new ValidationError(errors, validated, void 0, void 0, disableStackTrace));
      else resolve(validated);
    }));
  }
  validateSync(value, options) {
    var _options$disableStack3;
    let schema = this.resolve(Object.assign({}, options, {
      value
    }));
    let result;
    let disableStackTrace = (_options$disableStack3 = options == null ? void 0 : options.disableStackTrace) != null ? _options$disableStack3 : schema.spec.disableStackTrace;
    schema._validate(value, Object.assign({}, options, {
      sync: true
    }), (error, parsed) => {
      if (ValidationError.isError(error)) error.value = parsed;
      throw error;
    }, (errors, validated) => {
      if (errors.length) throw new ValidationError(errors, value, void 0, void 0, disableStackTrace);
      result = validated;
    });
    return result;
  }
  isValid(value, options) {
    return this.validate(value, options).then(() => true, (err) => {
      if (ValidationError.isError(err)) return false;
      throw err;
    });
  }
  isValidSync(value, options) {
    try {
      this.validateSync(value, options);
      return true;
    } catch (err) {
      if (ValidationError.isError(err)) return false;
      throw err;
    }
  }
  _getDefault(options) {
    let defaultValue = this.spec.default;
    if (defaultValue == null) {
      return defaultValue;
    }
    return typeof defaultValue === "function" ? defaultValue.call(this, options) : clone(defaultValue);
  }
  getDefault(options) {
    let schema = this.resolve(options || {});
    return schema._getDefault(options);
  }
  default(def) {
    if (arguments.length === 0) {
      return this._getDefault();
    }
    let next = this.clone({
      default: def
    });
    return next;
  }
  strict(isStrict = true) {
    return this.clone({
      strict: isStrict
    });
  }
  nullability(nullable, message) {
    const next = this.clone({
      nullable
    });
    next.internalTests.nullable = createValidation({
      message,
      name: "nullable",
      test(value) {
        return value === null ? this.schema.spec.nullable : true;
      }
    });
    return next;
  }
  optionality(optional, message) {
    const next = this.clone({
      optional
    });
    next.internalTests.optionality = createValidation({
      message,
      name: "optionality",
      test(value) {
        return value === void 0 ? this.schema.spec.optional : true;
      }
    });
    return next;
  }
  optional() {
    return this.optionality(true);
  }
  defined(message = mixed.defined) {
    return this.optionality(false, message);
  }
  nullable() {
    return this.nullability(true);
  }
  nonNullable(message = mixed.notNull) {
    return this.nullability(false, message);
  }
  required(message = mixed.required) {
    return this.clone().withMutation((next) => next.nonNullable(message).defined(message));
  }
  notRequired() {
    return this.clone().withMutation((next) => next.nullable().optional());
  }
  transform(fn) {
    let next = this.clone();
    next.transforms.push(fn);
    return next;
  }
  /**
   * Adds a test function to the schema's queue of tests.
   * tests can be exclusive or non-exclusive.
   *
   * - exclusive tests, will replace any existing tests of the same name.
   * - non-exclusive: can be stacked
   *
   * If a non-exclusive test is added to a schema with an exclusive test of the same name
   * the exclusive test is removed and further tests of the same name will be stacked.
   *
   * If an exclusive test is added to a schema with non-exclusive tests of the same name
   * the previous tests are removed and further tests of the same name will replace each other.
   */
  test(...args) {
    let opts;
    if (args.length === 1) {
      if (typeof args[0] === "function") {
        opts = {
          test: args[0]
        };
      } else {
        opts = args[0];
      }
    } else if (args.length === 2) {
      opts = {
        name: args[0],
        test: args[1]
      };
    } else {
      opts = {
        name: args[0],
        message: args[1],
        test: args[2]
      };
    }
    if (opts.message === void 0) opts.message = mixed.default;
    if (typeof opts.test !== "function") throw new TypeError("`test` is a required parameters");
    let next = this.clone();
    let validate = createValidation(opts);
    let isExclusive = opts.exclusive || opts.name && next.exclusiveTests[opts.name] === true;
    if (opts.exclusive) {
      if (!opts.name) throw new TypeError("Exclusive tests must provide a unique `name` identifying the test");
    }
    if (opts.name) next.exclusiveTests[opts.name] = !!opts.exclusive;
    next.tests = next.tests.filter((fn) => {
      if (fn.OPTIONS.name === opts.name) {
        if (isExclusive) return false;
        if (fn.OPTIONS.test === validate.OPTIONS.test) return false;
      }
      return true;
    });
    next.tests.push(validate);
    return next;
  }
  when(keys, options) {
    if (!Array.isArray(keys) && typeof keys !== "string") {
      options = keys;
      keys = ".";
    }
    let next = this.clone();
    let deps = toArray(keys).map((key) => new Reference(key));
    deps.forEach((dep) => {
      if (dep.isSibling) next.deps.push(dep.key);
    });
    next.conditions.push(typeof options === "function" ? new Condition(deps, options) : Condition.fromOptions(deps, options));
    return next;
  }
  typeError(message) {
    let next = this.clone();
    next.internalTests.typeError = createValidation({
      message,
      name: "typeError",
      skipAbsent: true,
      test(value) {
        if (!this.schema._typeCheck(value)) return this.createError({
          params: {
            type: this.schema.type
          }
        });
        return true;
      }
    });
    return next;
  }
  oneOf(enums, message = mixed.oneOf) {
    let next = this.clone();
    enums.forEach((val) => {
      next._whitelist.add(val);
      next._blacklist.delete(val);
    });
    next.internalTests.whiteList = createValidation({
      message,
      name: "oneOf",
      skipAbsent: true,
      test(value) {
        let valids = this.schema._whitelist;
        let resolved = valids.resolveAll(this.resolve);
        return resolved.includes(value) ? true : this.createError({
          params: {
            values: Array.from(valids).join(", "),
            resolved
          }
        });
      }
    });
    return next;
  }
  notOneOf(enums, message = mixed.notOneOf) {
    let next = this.clone();
    enums.forEach((val) => {
      next._blacklist.add(val);
      next._whitelist.delete(val);
    });
    next.internalTests.blacklist = createValidation({
      message,
      name: "notOneOf",
      test(value) {
        let invalids = this.schema._blacklist;
        let resolved = invalids.resolveAll(this.resolve);
        if (resolved.includes(value)) return this.createError({
          params: {
            values: Array.from(invalids).join(", "),
            resolved
          }
        });
        return true;
      }
    });
    return next;
  }
  strip(strip = true) {
    let next = this.clone();
    next.spec.strip = strip;
    return next;
  }
  /**
   * Return a serialized description of the schema including validations, flags, types etc.
   *
   * @param options Provide any needed context for resolving runtime schema alterations (lazy, when conditions, etc).
   */
  describe(options) {
    const next = (options ? this.resolve(options) : this).clone();
    const {
      label,
      meta,
      optional,
      nullable
    } = next.spec;
    const description = {
      meta,
      label,
      optional,
      nullable,
      default: next.getDefault(options),
      type: next.type,
      oneOf: next._whitelist.describe(),
      notOneOf: next._blacklist.describe(),
      tests: next.tests.map((fn) => ({
        name: fn.OPTIONS.name,
        params: fn.OPTIONS.params
      })).filter((n, idx, list) => list.findIndex((c) => c.name === n.name) === idx)
    };
    return description;
  }
};
Schema3.prototype.__isYupSchema__ = true;
for (const method of ["validate", "validateSync"]) Schema3.prototype[`${method}At`] = function(path, value, options = {}) {
  const {
    parent,
    parentPath,
    schema
  } = getIn(this, path, value, options.context);
  return schema[method](parent && parent[parentPath], Object.assign({}, options, {
    parent,
    path
  }));
};
for (const alias of ["equals", "is"]) Schema3.prototype[alias] = Schema3.prototype.oneOf;
for (const alias of ["not", "nope"]) Schema3.prototype[alias] = Schema3.prototype.notOneOf;
var returnsTrue = () => true;
function create$8(spec) {
  return new MixedSchema(spec);
}
var MixedSchema = class extends Schema3 {
  constructor(spec) {
    super(typeof spec === "function" ? {
      type: "mixed",
      check: spec
    } : Object.assign({
      type: "mixed",
      check: returnsTrue
    }, spec));
  }
};
create$8.prototype = MixedSchema.prototype;
function create$7() {
  return new BooleanSchema();
}
var BooleanSchema = class extends Schema3 {
  constructor() {
    super({
      type: "boolean",
      check(v) {
        if (v instanceof Boolean) v = v.valueOf();
        return typeof v === "boolean";
      }
    });
    this.withMutation(() => {
      this.transform((value, _raw, ctx) => {
        if (ctx.spec.coerce && !ctx.isType(value)) {
          if (/^(true|1)$/i.test(String(value))) return true;
          if (/^(false|0)$/i.test(String(value))) return false;
        }
        return value;
      });
    });
  }
  isTrue(message = boolean.isValue) {
    return this.test({
      message,
      name: "is-value",
      exclusive: true,
      params: {
        value: "true"
      },
      test(value) {
        return isAbsent(value) || value === true;
      }
    });
  }
  isFalse(message = boolean.isValue) {
    return this.test({
      message,
      name: "is-value",
      exclusive: true,
      params: {
        value: "false"
      },
      test(value) {
        return isAbsent(value) || value === false;
      }
    });
  }
  default(def) {
    return super.default(def);
  }
  defined(msg) {
    return super.defined(msg);
  }
  optional() {
    return super.optional();
  }
  required(msg) {
    return super.required(msg);
  }
  notRequired() {
    return super.notRequired();
  }
  nullable() {
    return super.nullable();
  }
  nonNullable(msg) {
    return super.nonNullable(msg);
  }
  strip(v) {
    return super.strip(v);
  }
};
create$7.prototype = BooleanSchema.prototype;
var isoReg = /^(\d{4}|[+-]\d{6})(?:-?(\d{2})(?:-?(\d{2}))?)?(?:[ T]?(\d{2}):?(\d{2})(?::?(\d{2})(?:[,.](\d{1,}))?)?(?:(Z)|([+-])(\d{2})(?::?(\d{2}))?)?)?$/;
function parseIsoDate(date2) {
  const struct = parseDateStruct(date2);
  if (!struct) return Date.parse ? Date.parse(date2) : Number.NaN;
  if (struct.z === void 0 && struct.plusMinus === void 0) {
    return new Date(struct.year, struct.month, struct.day, struct.hour, struct.minute, struct.second, struct.millisecond).valueOf();
  }
  let totalMinutesOffset = 0;
  if (struct.z !== "Z" && struct.plusMinus !== void 0) {
    totalMinutesOffset = struct.hourOffset * 60 + struct.minuteOffset;
    if (struct.plusMinus === "+") totalMinutesOffset = 0 - totalMinutesOffset;
  }
  return Date.UTC(struct.year, struct.month, struct.day, struct.hour, struct.minute + totalMinutesOffset, struct.second, struct.millisecond);
}
function parseDateStruct(date2) {
  var _regexResult$7$length, _regexResult$;
  const regexResult = isoReg.exec(date2);
  if (!regexResult) return null;
  return {
    year: toNumber(regexResult[1]),
    month: toNumber(regexResult[2], 1) - 1,
    day: toNumber(regexResult[3], 1),
    hour: toNumber(regexResult[4]),
    minute: toNumber(regexResult[5]),
    second: toNumber(regexResult[6]),
    millisecond: regexResult[7] ? (
      // allow arbitrary sub-second precision beyond milliseconds
      toNumber(regexResult[7].substring(0, 3))
    ) : 0,
    precision: (_regexResult$7$length = (_regexResult$ = regexResult[7]) == null ? void 0 : _regexResult$.length) != null ? _regexResult$7$length : void 0,
    z: regexResult[8] || void 0,
    plusMinus: regexResult[9] || void 0,
    hourOffset: toNumber(regexResult[10]),
    minuteOffset: toNumber(regexResult[11])
  };
}
function toNumber(str, defaultValue = 0) {
  return Number(str) || defaultValue;
}
var rEmail = (
  // eslint-disable-next-line
  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
);
var rUrl = (
  // eslint-disable-next-line
  /^((https?|ftp):)?\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
);
var rUUID = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
var yearMonthDay = "^\\d{4}-\\d{2}-\\d{2}";
var hourMinuteSecond = "\\d{2}:\\d{2}:\\d{2}";
var zOrOffset = "(([+-]\\d{2}(:?\\d{2})?)|Z)";
var rIsoDateTime = new RegExp(`${yearMonthDay}T${hourMinuteSecond}(\\.\\d+)?${zOrOffset}$`);
var isTrimmed = (value) => isAbsent(value) || value === value.trim();
var objStringTag = {}.toString();
function create$6() {
  return new StringSchema();
}
var StringSchema = class extends Schema3 {
  constructor() {
    super({
      type: "string",
      check(value) {
        if (value instanceof String) value = value.valueOf();
        return typeof value === "string";
      }
    });
    this.withMutation(() => {
      this.transform((value, _raw, ctx) => {
        if (!ctx.spec.coerce || ctx.isType(value)) return value;
        if (Array.isArray(value)) return value;
        const strValue = value != null && value.toString ? value.toString() : value;
        if (strValue === objStringTag) return value;
        return strValue;
      });
    });
  }
  required(message) {
    return super.required(message).withMutation((schema) => schema.test({
      message: message || mixed.required,
      name: "required",
      skipAbsent: true,
      test: (value) => !!value.length
    }));
  }
  notRequired() {
    return super.notRequired().withMutation((schema) => {
      schema.tests = schema.tests.filter((t) => t.OPTIONS.name !== "required");
      return schema;
    });
  }
  length(length, message = string.length) {
    return this.test({
      message,
      name: "length",
      exclusive: true,
      params: {
        length
      },
      skipAbsent: true,
      test(value) {
        return value.length === this.resolve(length);
      }
    });
  }
  min(min, message = string.min) {
    return this.test({
      message,
      name: "min",
      exclusive: true,
      params: {
        min
      },
      skipAbsent: true,
      test(value) {
        return value.length >= this.resolve(min);
      }
    });
  }
  max(max, message = string.max) {
    return this.test({
      name: "max",
      exclusive: true,
      message,
      params: {
        max
      },
      skipAbsent: true,
      test(value) {
        return value.length <= this.resolve(max);
      }
    });
  }
  matches(regex, options) {
    let excludeEmptyString = false;
    let message;
    let name;
    if (options) {
      if (typeof options === "object") {
        ({
          excludeEmptyString = false,
          message,
          name
        } = options);
      } else {
        message = options;
      }
    }
    return this.test({
      name: name || "matches",
      message: message || string.matches,
      params: {
        regex
      },
      skipAbsent: true,
      test: (value) => value === "" && excludeEmptyString || value.search(regex) !== -1
    });
  }
  email(message = string.email) {
    return this.matches(rEmail, {
      name: "email",
      message,
      excludeEmptyString: true
    });
  }
  url(message = string.url) {
    return this.matches(rUrl, {
      name: "url",
      message,
      excludeEmptyString: true
    });
  }
  uuid(message = string.uuid) {
    return this.matches(rUUID, {
      name: "uuid",
      message,
      excludeEmptyString: false
    });
  }
  datetime(options) {
    let message = "";
    let allowOffset;
    let precision;
    if (options) {
      if (typeof options === "object") {
        ({
          message = "",
          allowOffset = false,
          precision = void 0
        } = options);
      } else {
        message = options;
      }
    }
    return this.matches(rIsoDateTime, {
      name: "datetime",
      message: message || string.datetime,
      excludeEmptyString: true
    }).test({
      name: "datetime_offset",
      message: message || string.datetime_offset,
      params: {
        allowOffset
      },
      skipAbsent: true,
      test: (value) => {
        if (!value || allowOffset) return true;
        const struct = parseDateStruct(value);
        if (!struct) return false;
        return !!struct.z;
      }
    }).test({
      name: "datetime_precision",
      message: message || string.datetime_precision,
      params: {
        precision
      },
      skipAbsent: true,
      test: (value) => {
        if (!value || precision == void 0) return true;
        const struct = parseDateStruct(value);
        if (!struct) return false;
        return struct.precision === precision;
      }
    });
  }
  //-- transforms --
  ensure() {
    return this.default("").transform((val) => val === null ? "" : val);
  }
  trim(message = string.trim) {
    return this.transform((val) => val != null ? val.trim() : val).test({
      message,
      name: "trim",
      test: isTrimmed
    });
  }
  lowercase(message = string.lowercase) {
    return this.transform((value) => !isAbsent(value) ? value.toLowerCase() : value).test({
      message,
      name: "string_case",
      exclusive: true,
      skipAbsent: true,
      test: (value) => isAbsent(value) || value === value.toLowerCase()
    });
  }
  uppercase(message = string.uppercase) {
    return this.transform((value) => !isAbsent(value) ? value.toUpperCase() : value).test({
      message,
      name: "string_case",
      exclusive: true,
      skipAbsent: true,
      test: (value) => isAbsent(value) || value === value.toUpperCase()
    });
  }
};
create$6.prototype = StringSchema.prototype;
var isNaN$1 = (value) => value != +value;
function create$5() {
  return new NumberSchema();
}
var NumberSchema = class extends Schema3 {
  constructor() {
    super({
      type: "number",
      check(value) {
        if (value instanceof Number) value = value.valueOf();
        return typeof value === "number" && !isNaN$1(value);
      }
    });
    this.withMutation(() => {
      this.transform((value, _raw, ctx) => {
        if (!ctx.spec.coerce) return value;
        let parsed = value;
        if (typeof parsed === "string") {
          parsed = parsed.replace(/\s/g, "");
          if (parsed === "") return NaN;
          parsed = +parsed;
        }
        if (ctx.isType(parsed) || parsed === null) return parsed;
        return parseFloat(parsed);
      });
    });
  }
  min(min, message = number.min) {
    return this.test({
      message,
      name: "min",
      exclusive: true,
      params: {
        min
      },
      skipAbsent: true,
      test(value) {
        return value >= this.resolve(min);
      }
    });
  }
  max(max, message = number.max) {
    return this.test({
      message,
      name: "max",
      exclusive: true,
      params: {
        max
      },
      skipAbsent: true,
      test(value) {
        return value <= this.resolve(max);
      }
    });
  }
  lessThan(less, message = number.lessThan) {
    return this.test({
      message,
      name: "max",
      exclusive: true,
      params: {
        less
      },
      skipAbsent: true,
      test(value) {
        return value < this.resolve(less);
      }
    });
  }
  moreThan(more, message = number.moreThan) {
    return this.test({
      message,
      name: "min",
      exclusive: true,
      params: {
        more
      },
      skipAbsent: true,
      test(value) {
        return value > this.resolve(more);
      }
    });
  }
  positive(msg = number.positive) {
    return this.moreThan(0, msg);
  }
  negative(msg = number.negative) {
    return this.lessThan(0, msg);
  }
  integer(message = number.integer) {
    return this.test({
      name: "integer",
      message,
      skipAbsent: true,
      test: (val) => Number.isInteger(val)
    });
  }
  truncate() {
    return this.transform((value) => !isAbsent(value) ? value | 0 : value);
  }
  round(method) {
    var _method;
    let avail = ["ceil", "floor", "round", "trunc"];
    method = ((_method = method) == null ? void 0 : _method.toLowerCase()) || "round";
    if (method === "trunc") return this.truncate();
    if (avail.indexOf(method.toLowerCase()) === -1) throw new TypeError("Only valid options for round() are: " + avail.join(", "));
    return this.transform((value) => !isAbsent(value) ? Math[method](value) : value);
  }
};
create$5.prototype = NumberSchema.prototype;
var invalidDate = /* @__PURE__ */ new Date("");
var isDate = (obj) => Object.prototype.toString.call(obj) === "[object Date]";
function create$4() {
  return new DateSchema();
}
var DateSchema = class _DateSchema extends Schema3 {
  constructor() {
    super({
      type: "date",
      check(v) {
        return isDate(v) && !isNaN(v.getTime());
      }
    });
    this.withMutation(() => {
      this.transform((value, _raw, ctx) => {
        if (!ctx.spec.coerce || ctx.isType(value) || value === null) return value;
        value = parseIsoDate(value);
        return !isNaN(value) ? new Date(value) : _DateSchema.INVALID_DATE;
      });
    });
  }
  prepareParam(ref, name) {
    let param;
    if (!Reference.isRef(ref)) {
      let cast = this.cast(ref);
      if (!this._typeCheck(cast)) throw new TypeError(`\`${name}\` must be a Date or a value that can be \`cast()\` to a Date`);
      param = cast;
    } else {
      param = ref;
    }
    return param;
  }
  min(min, message = date.min) {
    let limit = this.prepareParam(min, "min");
    return this.test({
      message,
      name: "min",
      exclusive: true,
      params: {
        min
      },
      skipAbsent: true,
      test(value) {
        return value >= this.resolve(limit);
      }
    });
  }
  max(max, message = date.max) {
    let limit = this.prepareParam(max, "max");
    return this.test({
      message,
      name: "max",
      exclusive: true,
      params: {
        max
      },
      skipAbsent: true,
      test(value) {
        return value <= this.resolve(limit);
      }
    });
  }
};
DateSchema.INVALID_DATE = invalidDate;
create$4.prototype = DateSchema.prototype;
create$4.INVALID_DATE = invalidDate;
function sortFields(fields, excludedEdges = []) {
  let edges = [];
  let nodes = /* @__PURE__ */ new Set();
  let excludes = new Set(excludedEdges.map(([a, b]) => `${a}-${b}`));
  function addNode(depPath, key) {
    let node = (0, import_property_expr.split)(depPath)[0];
    nodes.add(node);
    if (!excludes.has(`${key}-${node}`)) edges.push([key, node]);
  }
  for (const key of Object.keys(fields)) {
    let value = fields[key];
    nodes.add(key);
    if (Reference.isRef(value) && value.isSibling) addNode(value.path, key);
    else if (isSchema(value) && "deps" in value) value.deps.forEach((path) => addNode(path, key));
  }
  return import_toposort.default.array(Array.from(nodes), edges).reverse();
}
function findIndex(arr, err) {
  let idx = Infinity;
  arr.some((key, ii) => {
    var _err$path;
    if ((_err$path = err.path) != null && _err$path.includes(key)) {
      idx = ii;
      return true;
    }
  });
  return idx;
}
function sortByKeyOrder(keys) {
  return (a, b) => {
    return findIndex(keys, a) - findIndex(keys, b);
  };
}
var parseJson = (value, _, ctx) => {
  if (typeof value !== "string") {
    return value;
  }
  let parsed = value;
  try {
    parsed = JSON.parse(value);
  } catch (err) {
  }
  return ctx.isType(parsed) ? parsed : value;
};
function deepPartial(schema) {
  if ("fields" in schema) {
    const partial = {};
    for (const [key, fieldSchema] of Object.entries(schema.fields)) {
      partial[key] = deepPartial(fieldSchema);
    }
    return schema.setFields(partial);
  }
  if (schema.type === "array") {
    const nextArray = schema.optional();
    if (nextArray.innerType) nextArray.innerType = deepPartial(nextArray.innerType);
    return nextArray;
  }
  if (schema.type === "tuple") {
    return schema.optional().clone({
      types: schema.spec.types.map(deepPartial)
    });
  }
  if ("optional" in schema) {
    return schema.optional();
  }
  return schema;
}
var deepHas = (obj, p) => {
  const path = [...(0, import_property_expr.normalizePath)(p)];
  if (path.length === 1) return path[0] in obj;
  let last = path.pop();
  let parent = (0, import_property_expr.getter)((0, import_property_expr.join)(path), true)(obj);
  return !!(parent && last in parent);
};
var isObject = (obj) => Object.prototype.toString.call(obj) === "[object Object]";
function unknown(ctx, value) {
  let known = Object.keys(ctx.fields);
  return Object.keys(value).filter((key) => known.indexOf(key) === -1);
}
var defaultSort = sortByKeyOrder([]);
function create$3(spec) {
  return new ObjectSchema(spec);
}
var ObjectSchema = class extends Schema3 {
  constructor(spec) {
    super({
      type: "object",
      check(value) {
        return isObject(value) || typeof value === "function";
      }
    });
    this.fields = /* @__PURE__ */ Object.create(null);
    this._sortErrors = defaultSort;
    this._nodes = [];
    this._excludedEdges = [];
    this.withMutation(() => {
      if (spec) {
        this.shape(spec);
      }
    });
  }
  _cast(_value, options = {}) {
    var _options$stripUnknown;
    let value = super._cast(_value, options);
    if (value === void 0) return this.getDefault(options);
    if (!this._typeCheck(value)) return value;
    let fields = this.fields;
    let strip = (_options$stripUnknown = options.stripUnknown) != null ? _options$stripUnknown : this.spec.noUnknown;
    let props = [].concat(this._nodes, Object.keys(value).filter((v) => !this._nodes.includes(v)));
    let intermediateValue = {};
    let innerOptions = Object.assign({}, options, {
      parent: intermediateValue,
      __validating: options.__validating || false
    });
    let isChanged = false;
    for (const prop of props) {
      let field = fields[prop];
      let exists = prop in value;
      if (field) {
        let fieldValue;
        let inputValue = value[prop];
        innerOptions.path = (options.path ? `${options.path}.` : "") + prop;
        field = field.resolve({
          value: inputValue,
          context: options.context,
          parent: intermediateValue
        });
        let fieldSpec = field instanceof Schema3 ? field.spec : void 0;
        let strict = fieldSpec == null ? void 0 : fieldSpec.strict;
        if (fieldSpec != null && fieldSpec.strip) {
          isChanged = isChanged || prop in value;
          continue;
        }
        fieldValue = !options.__validating || !strict ? (
          // TODO: use _cast, this is double resolving
          field.cast(value[prop], innerOptions)
        ) : value[prop];
        if (fieldValue !== void 0) {
          intermediateValue[prop] = fieldValue;
        }
      } else if (exists && !strip) {
        intermediateValue[prop] = value[prop];
      }
      if (exists !== prop in intermediateValue || intermediateValue[prop] !== value[prop]) {
        isChanged = true;
      }
    }
    return isChanged ? intermediateValue : value;
  }
  _validate(_value, options = {}, panic, next) {
    let {
      from = [],
      originalValue = _value,
      recursive = this.spec.recursive
    } = options;
    options.from = [{
      schema: this,
      value: originalValue
    }, ...from];
    options.__validating = true;
    options.originalValue = originalValue;
    super._validate(_value, options, panic, (objectErrors, value) => {
      if (!recursive || !isObject(value)) {
        next(objectErrors, value);
        return;
      }
      originalValue = originalValue || value;
      let tests = [];
      for (let key of this._nodes) {
        let field = this.fields[key];
        if (!field || Reference.isRef(field)) {
          continue;
        }
        tests.push(field.asNestedTest({
          options,
          key,
          parent: value,
          parentPath: options.path,
          originalParent: originalValue
        }));
      }
      this.runTests({
        tests,
        value,
        originalValue,
        options
      }, panic, (fieldErrors) => {
        next(fieldErrors.sort(this._sortErrors).concat(objectErrors), value);
      });
    });
  }
  clone(spec) {
    const next = super.clone(spec);
    next.fields = Object.assign({}, this.fields);
    next._nodes = this._nodes;
    next._excludedEdges = this._excludedEdges;
    next._sortErrors = this._sortErrors;
    return next;
  }
  concat(schema) {
    let next = super.concat(schema);
    let nextFields = next.fields;
    for (let [field, schemaOrRef] of Object.entries(this.fields)) {
      const target = nextFields[field];
      nextFields[field] = target === void 0 ? schemaOrRef : target;
    }
    return next.withMutation((s) => (
      // XXX: excludes here is wrong
      s.setFields(nextFields, [...this._excludedEdges, ...schema._excludedEdges])
    ));
  }
  _getDefault(options) {
    if ("default" in this.spec) {
      return super._getDefault(options);
    }
    if (!this._nodes.length) {
      return void 0;
    }
    let dft = {};
    this._nodes.forEach((key) => {
      var _innerOptions;
      const field = this.fields[key];
      let innerOptions = options;
      if ((_innerOptions = innerOptions) != null && _innerOptions.value) {
        innerOptions = Object.assign({}, innerOptions, {
          parent: innerOptions.value,
          value: innerOptions.value[key]
        });
      }
      dft[key] = field && "getDefault" in field ? field.getDefault(innerOptions) : void 0;
    });
    return dft;
  }
  setFields(shape, excludedEdges) {
    let next = this.clone();
    next.fields = shape;
    next._nodes = sortFields(shape, excludedEdges);
    next._sortErrors = sortByKeyOrder(Object.keys(shape));
    if (excludedEdges) next._excludedEdges = excludedEdges;
    return next;
  }
  shape(additions, excludes = []) {
    return this.clone().withMutation((next) => {
      let edges = next._excludedEdges;
      if (excludes.length) {
        if (!Array.isArray(excludes[0])) excludes = [excludes];
        edges = [...next._excludedEdges, ...excludes];
      }
      return next.setFields(Object.assign(next.fields, additions), edges);
    });
  }
  partial() {
    const partial = {};
    for (const [key, schema] of Object.entries(this.fields)) {
      partial[key] = "optional" in schema && schema.optional instanceof Function ? schema.optional() : schema;
    }
    return this.setFields(partial);
  }
  deepPartial() {
    const next = deepPartial(this);
    return next;
  }
  pick(keys) {
    const picked = {};
    for (const key of keys) {
      if (this.fields[key]) picked[key] = this.fields[key];
    }
    return this.setFields(picked, this._excludedEdges.filter(([a, b]) => keys.includes(a) && keys.includes(b)));
  }
  omit(keys) {
    const remaining = [];
    for (const key of Object.keys(this.fields)) {
      if (keys.includes(key)) continue;
      remaining.push(key);
    }
    return this.pick(remaining);
  }
  from(from, to, alias) {
    let fromGetter = (0, import_property_expr.getter)(from, true);
    return this.transform((obj) => {
      if (!obj) return obj;
      let newObj = obj;
      if (deepHas(obj, from)) {
        newObj = Object.assign({}, obj);
        if (!alias) delete newObj[from];
        newObj[to] = fromGetter(obj);
      }
      return newObj;
    });
  }
  /** Parse an input JSON string to an object */
  json() {
    return this.transform(parseJson);
  }
  noUnknown(noAllow = true, message = object.noUnknown) {
    if (typeof noAllow !== "boolean") {
      message = noAllow;
      noAllow = true;
    }
    let next = this.test({
      name: "noUnknown",
      exclusive: true,
      message,
      test(value) {
        if (value == null) return true;
        const unknownKeys = unknown(this.schema, value);
        return !noAllow || unknownKeys.length === 0 || this.createError({
          params: {
            unknown: unknownKeys.join(", ")
          }
        });
      }
    });
    next.spec.noUnknown = noAllow;
    return next;
  }
  unknown(allow = true, message = object.noUnknown) {
    return this.noUnknown(!allow, message);
  }
  transformKeys(fn) {
    return this.transform((obj) => {
      if (!obj) return obj;
      const result = {};
      for (const key of Object.keys(obj)) result[fn(key)] = obj[key];
      return result;
    });
  }
  camelCase() {
    return this.transformKeys(import_tiny_case.camelCase);
  }
  snakeCase() {
    return this.transformKeys(import_tiny_case.snakeCase);
  }
  constantCase() {
    return this.transformKeys((key) => (0, import_tiny_case.snakeCase)(key).toUpperCase());
  }
  describe(options) {
    const next = (options ? this.resolve(options) : this).clone();
    const base = super.describe(options);
    base.fields = {};
    for (const [key, value] of Object.entries(next.fields)) {
      var _innerOptions2;
      let innerOptions = options;
      if ((_innerOptions2 = innerOptions) != null && _innerOptions2.value) {
        innerOptions = Object.assign({}, innerOptions, {
          parent: innerOptions.value,
          value: innerOptions.value[key]
        });
      }
      base.fields[key] = value.describe(innerOptions);
    }
    return base;
  }
};
create$3.prototype = ObjectSchema.prototype;
function create$2(type) {
  return new ArraySchema(type);
}
var ArraySchema = class extends Schema3 {
  constructor(type) {
    super({
      type: "array",
      spec: {
        types: type
      },
      check(v) {
        return Array.isArray(v);
      }
    });
    this.innerType = void 0;
    this.innerType = type;
  }
  _cast(_value, _opts) {
    const value = super._cast(_value, _opts);
    if (!this._typeCheck(value) || !this.innerType) {
      return value;
    }
    let isChanged = false;
    const castArray = value.map((v, idx) => {
      const castElement = this.innerType.cast(v, Object.assign({}, _opts, {
        path: `${_opts.path || ""}[${idx}]`
      }));
      if (castElement !== v) {
        isChanged = true;
      }
      return castElement;
    });
    return isChanged ? castArray : value;
  }
  _validate(_value, options = {}, panic, next) {
    var _options$recursive;
    let innerType = this.innerType;
    let recursive = (_options$recursive = options.recursive) != null ? _options$recursive : this.spec.recursive;
    options.originalValue != null ? options.originalValue : _value;
    super._validate(_value, options, panic, (arrayErrors, value) => {
      var _options$originalValu2;
      if (!recursive || !innerType || !this._typeCheck(value)) {
        next(arrayErrors, value);
        return;
      }
      let tests = new Array(value.length);
      for (let index = 0; index < value.length; index++) {
        var _options$originalValu;
        tests[index] = innerType.asNestedTest({
          options,
          index,
          parent: value,
          parentPath: options.path,
          originalParent: (_options$originalValu = options.originalValue) != null ? _options$originalValu : _value
        });
      }
      this.runTests({
        value,
        tests,
        originalValue: (_options$originalValu2 = options.originalValue) != null ? _options$originalValu2 : _value,
        options
      }, panic, (innerTypeErrors) => next(innerTypeErrors.concat(arrayErrors), value));
    });
  }
  clone(spec) {
    const next = super.clone(spec);
    next.innerType = this.innerType;
    return next;
  }
  /** Parse an input JSON string to an object */
  json() {
    return this.transform(parseJson);
  }
  concat(schema) {
    let next = super.concat(schema);
    next.innerType = this.innerType;
    if (schema.innerType)
      next.innerType = next.innerType ? (
        // @ts-expect-error Lazy doesn't have concat and will break
        next.innerType.concat(schema.innerType)
      ) : schema.innerType;
    return next;
  }
  of(schema) {
    let next = this.clone();
    if (!isSchema(schema)) throw new TypeError("`array.of()` sub-schema must be a valid yup schema not: " + printValue(schema));
    next.innerType = schema;
    next.spec = Object.assign({}, next.spec, {
      types: schema
    });
    return next;
  }
  length(length, message = array.length) {
    return this.test({
      message,
      name: "length",
      exclusive: true,
      params: {
        length
      },
      skipAbsent: true,
      test(value) {
        return value.length === this.resolve(length);
      }
    });
  }
  min(min, message) {
    message = message || array.min;
    return this.test({
      message,
      name: "min",
      exclusive: true,
      params: {
        min
      },
      skipAbsent: true,
      // FIXME(ts): Array<typeof T>
      test(value) {
        return value.length >= this.resolve(min);
      }
    });
  }
  max(max, message) {
    message = message || array.max;
    return this.test({
      message,
      name: "max",
      exclusive: true,
      params: {
        max
      },
      skipAbsent: true,
      test(value) {
        return value.length <= this.resolve(max);
      }
    });
  }
  ensure() {
    return this.default(() => []).transform((val, original) => {
      if (this._typeCheck(val)) return val;
      return original == null ? [] : [].concat(original);
    });
  }
  compact(rejector) {
    let reject = !rejector ? (v) => !!v : (v, i, a) => !rejector(v, i, a);
    return this.transform((values) => values != null ? values.filter(reject) : values);
  }
  describe(options) {
    const next = (options ? this.resolve(options) : this).clone();
    const base = super.describe(options);
    if (next.innerType) {
      var _innerOptions;
      let innerOptions = options;
      if ((_innerOptions = innerOptions) != null && _innerOptions.value) {
        innerOptions = Object.assign({}, innerOptions, {
          parent: innerOptions.value,
          value: innerOptions.value[0]
        });
      }
      base.innerType = next.innerType.describe(innerOptions);
    }
    return base;
  }
};
create$2.prototype = ArraySchema.prototype;
function create$1(schemas) {
  return new TupleSchema(schemas);
}
var TupleSchema = class extends Schema3 {
  constructor(schemas) {
    super({
      type: "tuple",
      spec: {
        types: schemas
      },
      check(v) {
        const types = this.spec.types;
        return Array.isArray(v) && v.length === types.length;
      }
    });
    this.withMutation(() => {
      this.typeError(tuple.notType);
    });
  }
  _cast(inputValue, options) {
    const {
      types
    } = this.spec;
    const value = super._cast(inputValue, options);
    if (!this._typeCheck(value)) {
      return value;
    }
    let isChanged = false;
    const castArray = types.map((type, idx) => {
      const castElement = type.cast(value[idx], Object.assign({}, options, {
        path: `${options.path || ""}[${idx}]`
      }));
      if (castElement !== value[idx]) isChanged = true;
      return castElement;
    });
    return isChanged ? castArray : value;
  }
  _validate(_value, options = {}, panic, next) {
    let itemTypes = this.spec.types;
    super._validate(_value, options, panic, (tupleErrors, value) => {
      var _options$originalValu2;
      if (!this._typeCheck(value)) {
        next(tupleErrors, value);
        return;
      }
      let tests = [];
      for (let [index, itemSchema] of itemTypes.entries()) {
        var _options$originalValu;
        tests[index] = itemSchema.asNestedTest({
          options,
          index,
          parent: value,
          parentPath: options.path,
          originalParent: (_options$originalValu = options.originalValue) != null ? _options$originalValu : _value
        });
      }
      this.runTests({
        value,
        tests,
        originalValue: (_options$originalValu2 = options.originalValue) != null ? _options$originalValu2 : _value,
        options
      }, panic, (innerTypeErrors) => next(innerTypeErrors.concat(tupleErrors), value));
    });
  }
  describe(options) {
    const next = (options ? this.resolve(options) : this).clone();
    const base = super.describe(options);
    base.innerType = next.spec.types.map((schema, index) => {
      var _innerOptions;
      let innerOptions = options;
      if ((_innerOptions = innerOptions) != null && _innerOptions.value) {
        innerOptions = Object.assign({}, innerOptions, {
          parent: innerOptions.value,
          value: innerOptions.value[index]
        });
      }
      return schema.describe(innerOptions);
    });
    return base;
  }
};
create$1.prototype = TupleSchema.prototype;

// src/validations/teacherRequestSchema.ts
var teacherRequestSchema = create$3().shape({
  qualification: create$6().max(50, "Qualification must be 50 characters or less").required("Qualification is required"),
  experience: create$5().typeError("Experience must be a number").max(50, "Experience must be 50 years or less").required("Experience is required"),
  subjectsToTeach: create$6().max(50, "Subjects must be 50 characters or less").required("Subjects to teach are required"),
  bio: create$6().min(20, "Bio must be at least 20 characters").max(50, "Bio must be 50 characters or less").required("Bio is required")
});

// src/interfaces/controllers/teacher/teacherReqController.ts
var createTeacherRequest2 = (req, res) => __async(void 0, null, function* () {
  try {
    yield teacherRequestSchema.validate(req.body, { abortEarly: false });
    const { qualification, experience, subjectsToTeach, bio } = req.body;
    const userId = req.user.id;
    const existingRequest = yield findOne({ userId });
    if (existingRequest) {
      return res.status(400).json({ message: "A request from this user already exists." });
    }
    const newRequest = yield createTeacherRequest({
      userId,
      highestQualification: qualification,
      yearsOfTeachingExperience: experience,
      subjects: subjectsToTeach,
      bio,
      status: "pending"
    });
    res.status(201).json({ message: "Teacher request created successfully", data: newRequest });
  } catch (error) {
    res.status(500).json({ message: "Error creating teacher request", error });
  }
});
var teacherRequestStatus = (req, res) => __async(void 0, null, function* () {
  try {
    const userId = req.user.id;
    const request = yield findOne({ userId });
    if (!request) {
      return res.status(404).json({ message: "No teacher request found for the user." });
    }
    res.status(200).json({
      request: {
        highestQualification: request.highestQualification,
        yearsOfTeachingExperience: request.yearsOfTeachingExperience,
        subjects: request.subjects,
        bio: request.bio
      },
      status: request.status
    });
  } catch (error) {
    console.log(error);
    console.error("Error fetching teacher request status:", error);
    res.status(500).json({ message: "Error fetching teacher request status", error });
  }
});
var getAllTeacherRequests2 = (req, res) => __async(void 0, null, function* () {
  try {
    const requests = yield getAllTeacherRequests();
    res.status(200).json({ data: requests });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving teacher requests", error });
  }
});
var getTeacherRequestById2 = (req, res) => __async(void 0, null, function* () {
  try {
    const { id } = req.params;
    const request = yield getTeacherRequestById(id);
    if (!request) {
      return res.status(404).json({ message: "Teacher request not found" });
    }
    res.status(200).json({ data: request });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving teacher request", error });
  }
});
var updateTeacherRequestStatus2 = (req, res) => __async(void 0, null, function* () {
  const { id } = req.params;
  const { status } = req.body;
  console.log(`status: ${status}`, `id: ${id}`);
  try {
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const updatedRequest = yield updateTeacherRequestStatus(id, status);
    if (!updatedRequest) {
      return res.status(404).json({ message: "Teacher request not found" });
    }
    if (status === "approved") {
      yield userRepository.updateUserRole(updatedRequest.userId, "teacher");
    }
    if (status === "rejected") {
      yield userRepository.updateUserRole(updatedRequest.userId, "user");
    }
    res.status(200).json({ message: "Teacher request status updated", data: updatedRequest });
  } catch (error) {
    res.status(500).json({ message: "Error updating teacher request status", error });
  }
});
var deleteTeacherRequest2 = (req, res) => __async(void 0, null, function* () {
  const { id } = req.params;
  try {
    const request = yield getTeacherRequestById(id);
    if (!request) {
      return res.status(404).json({ message: "Teacher request not found" });
    }
    if (request.status === "approved") {
      console.log("Cannot delete approved request. Please reject it first.");
      return res.status(400).json({ message: "Cannot delete approved request. Please reject it first." });
    }
    yield deleteTeacherRequest(id);
    res.status(200).json({ message: "Teacher request deleted successfully" });
  } catch (error) {
    console.error("Error deleting teacher request:", error);
    res.status(500).json({ message: "Error deleting teacher request", error });
  }
});

// src/infrastructure/database/models/Course.ts
var import_mongoose3 = __toESM(require("mongoose"));
var CourseSchema = new import_mongoose3.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructorId: { type: String, required: true },
  duration: { type: Number, required: true },
  startDate: { type: Date, required: true },
  fees: { type: Number, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  isBlocked: { type: Boolean, default: false },
  enrollmentCount: { type: Number, default: 0 }
  // modules: [{ type: Schema.Types.ObjectId, ref: 'Module' }]
});
var Course_default = import_mongoose3.default.model("Course", CourseSchema);

// src/application/repositories/courseRepository.ts
var createCourse = (courseData) => __async(void 0, null, function* () {
  const course = new Course_default(courseData);
  return course.save();
});
var updateCourse = (id, courseData) => __async(void 0, null, function* () {
  return Course_default.findByIdAndUpdate(id, courseData, { new: true });
});
var deleteCourse = (id) => __async(void 0, null, function* () {
  return Course_default.findByIdAndDelete(id);
});
var getCourseById = (id) => __async(void 0, null, function* () {
  return Course_default.findById(id);
});
var getAllCourses = () => __async(void 0, null, function* () {
  return Course_default.find();
});
var getCoursesByTeacher = (instructorId) => __async(void 0, null, function* () {
  return Course_default.find({ instructorId }).exec();
});

// src/interfaces/dots/CourseDTO.ts
var mapToCourseListingDTO = (course) => {
  return {
    id: course._id.toString(),
    title: course.title,
    description: course.description,
    imageUrl: course.imageUrl,
    fees: course.fees
  };
};

// src/application/services/courseService.ts
var createNewCourse = (courseData) => __async(void 0, null, function* () {
  console.log("courseData", courseData);
  return createCourse(courseData);
});
var updateExistingCourse = (id, courseData) => __async(void 0, null, function* () {
  return updateCourse(id, courseData);
});
var deleteCourseById = (id) => __async(void 0, null, function* () {
  return deleteCourse(id);
});
var getCourseDetails = (id) => __async(void 0, null, function* () {
  return getCourseById(id);
});
var getAllCourseDetails = () => __async(void 0, null, function* () {
  const response = yield getAllCourses();
  return response.map(mapToCourseListingDTO);
});
var getAllCourseDetailsbyTeacher = (instructorId) => __async(void 0, null, function* () {
  const courses = yield getCoursesByTeacher(instructorId);
  return courses.map((course) => ({
    id: course._id.toString(),
    title: course.title,
    description: course.description,
    imageUrl: course.imageUrl,
    fees: course.fees
  }));
});

// src/infrastructure/cloudinaryConfig.ts
var import_cloudinary = require("cloudinary");
var dotenv2 = __toESM(require("dotenv"));
dotenv2.config();
import_cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
var cloudinaryConfig_default = import_cloudinary.v2;

// src/interfaces/controllers/teacher/courseController.ts
var createCourse2 = (req, res) => __async(void 0, null, function* () {
  var _a, _b;
  try {
    if (!req.file) {
      console.log("no file");
      return res.status(400).send("No file uploaded.");
    }
    const fileStr = req.file.buffer.toString("base64");
    const uploadResponse = yield cloudinaryConfig_default.uploader.upload(`data:${req.file.mimetype};base64,${fileStr}`, {
      folder: "courses",
      resource_type: "auto"
    });
    const instructorId = (_b = (_a = req.user) == null ? void 0 : _a.id) != null ? _b : null;
    const publicUrl = uploadResponse.secure_url;
    const courseData = __spreadProps(__spreadValues({}, req.body), {
      imageUrl: publicUrl,
      // Assuming your course schema includes an imageUrl field
      instructorId
      // Assuming your course schema includes an imageUrl field
    });
    const course = yield createNewCourse(courseData);
    res.status(201).json(course);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: error.message });
  }
});
var updateCourse2 = (req, res) => __async(void 0, null, function* () {
  var _a, _b;
  try {
    const existingCourse = yield getCourseDetails(req.params.id);
    if (!existingCourse) {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    if (req.file) {
      const oldImageUrl = (_a = existingCourse.imageUrl) != null ? _a : null;
      if (oldImageUrl) {
        const publicId = (_b = oldImageUrl.split("/").pop()) == null ? void 0 : _b.split(".")[0];
        console.log("publicId", publicId);
        if (publicId) {
          yield cloudinaryConfig_default.uploader.destroy(`courses/${publicId}`);
        }
      }
      const fileStr = req.file.buffer.toString("base64");
      const uploadResponse = yield cloudinaryConfig_default.uploader.upload(`data:${req.file.mimetype};base64,${fileStr}`, {
        folder: "courses",
        resource_type: "auto"
      });
      req.body.imageUrl = uploadResponse.secure_url;
    }
    const course = yield updateExistingCourse(req.params.id, req.body);
    if (course) {
      res.status(200).json(course);
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
var deleteCourse2 = (req, res) => __async(void 0, null, function* () {
  try {
    const course = yield deleteCourseById(req.params.id);
    if (course) {
      res.status(200).json({ message: "Course deleted successfully" });
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
var getCourse = (req, res) => __async(void 0, null, function* () {
  try {
    const course = yield getCourseDetails(req.params.id);
    if (course) {
      res.status(200).json(course);
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
var getCourses = (_req, res) => __async(void 0, null, function* () {
  try {
    const courses = yield getAllCourseDetails();
    res.status(200).json({ data: courses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
var getCoursesbyTeacher = (_req, res) => __async(void 0, null, function* () {
  var _a, _b;
  try {
    const courses = yield getAllCourseDetailsbyTeacher((_b = (_a = _req.user) == null ? void 0 : _a.id) != null ? _b : null);
    res.status(200).json({ data: courses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
var updateContents = (_req, res) => __async(void 0, null, function* () {
  try {
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// src/application/use-cases/user/CourseEnrollmentUseCase.ts
var createUserCourseUseCase = (repository2) => ({
  getUserPurchasedCourses: (userId) => __async(void 0, null, function* () {
    return repository2.getUserPurchasedCourses(userId);
  }),
  enrollCourse: (userId, courseId, enrollmentDetails) => __async(void 0, null, function* () {
    const existingEnrollment = yield repository2.getEnrollment(userId, courseId);
    if (existingEnrollment) {
      throw new Error("User is already enrolled in this course");
    }
    return repository2.enrollCourse(userId, courseId, enrollmentDetails, 0);
  }),
  getEnrollment: (userId, courseId) => __async(void 0, null, function* () {
    return repository2.getEnrollment(userId, courseId);
  }),
  getCourseDetails: (courseId) => __async(void 0, null, function* () {
    return repository2.getCourseById(courseId);
  }),
  isCoursePurchased: (userId, courseId) => __async(void 0, null, function* () {
    const enrollment = yield repository2.isCoursePurchased(userId, courseId);
    return !!enrollment;
  })
});

// src/infrastructure/database/models/Enrollment.ts
var import_mongoose4 = require("mongoose");
var courseDetailSchema = new import_mongoose4.Schema({
  courseId: {
    type: import_mongoose4.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  price: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["paid", "pending", "refunded"],
    default: "pending"
  },
  enrollmentDetails: {
    type: String,
    // Additional details if needed
    default: ""
  },
  paymentId: {
    type: String,
    // Store payment ID as a string
    default: ""
    // Default to an empty string if not provided
  }
});
var enrollmentSchema = new import_mongoose4.Schema({
  userId: {
    type: import_mongoose4.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  courses: [courseDetailSchema]
});
var Enrollment = (0, import_mongoose4.model)("Enrollment", enrollmentSchema);
var Enrollment_default = Enrollment;

// src/application/repositories/CourseEnrollmentRepository.ts
var import_mongoose5 = __toESM(require("mongoose"));
var createUserCourseRepository = () => ({
  getUserPurchasedCourses: (userId) => __async(void 0, null, function* () {
    const userIdObj = import_mongoose5.default.Types.ObjectId(userId);
    const enrollments = yield Enrollment_default.find({ userId: userIdObj });
    const courseIds = enrollments.map((enrollment) => enrollment.courses.map((courseDetail) => courseDetail.courseId)).reduce((acc, courseIdArray) => acc.concat(courseIdArray), []);
    return yield Course_default.find({ _id: { $in: courseIds } }, { instructorId: 0 });
  }),
  enrollCourse: (userId, courseId, paymentId, amount) => __async(void 0, null, function* () {
    const userIdObj = import_mongoose5.default.Types.ObjectId(userId);
    const courseIdObj = import_mongoose5.default.Types.ObjectId(courseId);
    const newEnrollment = new Enrollment_default({
      userId: userIdObj,
      courses: [__spreadValues({
        courseId: courseIdObj,
        price: amount
      }, paymentId ? { paymentId } : {})]
    });
    return yield newEnrollment.save();
  }),
  getEnrollment: (userId, paymentId, courseId) => __async(void 0, null, function* () {
    const userIdObj = import_mongoose5.default.Types.ObjectId(userId);
    console.log(`userIdObj: ${userIdObj} paymentId: ${paymentId}`);
    const data = yield Enrollment_default.findOne({
      userId: userIdObj,
      "courses.paymentId": paymentId
    });
    console.log("Found data:", data);
    if (!data) {
      console.log("No matching document found");
      return null;
    }
    const enrollment = yield Enrollment_default.findOneAndUpdate(
      {
        userId: userIdObj,
        "courses.paymentId": paymentId
      },
      { $set: { "courses.$.status": "paid" } },
      { new: true }
    );
    if (courseId) {
      yield Course_default.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });
    }
    console.log("Updated enrollment:", enrollment);
    return enrollment;
  }),
  getCourseById: (courseId) => __async(void 0, null, function* () {
    const courseIdObj = import_mongoose5.default.Types.ObjectId(courseId);
    try {
      const courseDetails = yield Course_default.aggregate([
        { $match: { _id: courseIdObj } },
        {
          $addFields: {
            instructorId: { $toObjectId: "$instructorId" }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "instructorId",
            foreignField: "_id",
            as: "instructorDetails"
          }
        },
        { $unwind: { path: "$instructorDetails", preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            instructorName: { $ifNull: ["$instructorDetails.name", "N/A"] },
            instructorEmail: { $ifNull: ["$instructorDetails.email", "N/A"] }
          }
        },
        {
          $project: {
            instructorDetails: 0
          }
        }
      ]);
      return courseDetails.length ? courseDetails[0] : null;
    } catch (error) {
      console.error("Error fetching course details:", error);
      throw error;
    }
  }),
  getCourseAmountById: (courseId) => __async(void 0, null, function* () {
    const courseIdObj = import_mongoose5.default.Types.ObjectId(courseId);
    console.log("courseIdObj:", courseIdObj);
    try {
      const course = yield Course_default.findById(courseIdObj).lean();
      if (!course) {
        console.log("No course found with this ID");
        return null;
      }
      if (!("fees" in course)) {
        console.log("Course found, but no fees field present");
        return null;
      }
      return course.fees;
    } catch (error) {
      console.error("Error fetching course amount:", error);
      throw error;
    }
  }),
  isCoursePurchased: (userId, courseId) => __async(void 0, null, function* () {
    const userIdObj = import_mongoose5.default.Types.ObjectId(userId);
    const courseIdObj = import_mongoose5.default.Types.ObjectId(courseId);
    const enrollment = yield Enrollment_default.findOne({
      userId: userIdObj,
      "courses.courseId": courseIdObj
    });
    return !!enrollment;
  })
});

// src/interfaces/controllers/user/userCourseController.ts
var userRepository2 = createUserCourseRepository();
var useCase = createUserCourseUseCase(userRepository2);
var getUserPurchasedCourses = (req, res) => __async(void 0, null, function* () {
  var _a, _b;
  try {
    const userId = (_b = (_a = req.user) == null ? void 0 : _a.id) != null ? _b : null;
    if (!userId) {
      res.status(400).json({ message: "User not authenticated" });
      return;
    }
    const courses = yield useCase.getUserPurchasedCourses(userId);
    res.status(200).json({ data: courses.map(mapToCourseListingDTO) });
  } catch (error) {
    res.status(500).json({ message: "Error fetching purchased courses", error });
  }
});
var checkCoursePurchased = (req, res) => __async(void 0, null, function* () {
  var _a, _b;
  try {
    const userId = (_b = (_a = req.user) == null ? void 0 : _a.id) != null ? _b : null;
    const { courseId } = req.params;
    if (!userId) {
      res.status(400).json({ message: "User not authenticated" });
      return;
    }
    const enrollment = yield useCase.getEnrollment(userId, courseId);
    const isPurchased = enrollment !== null;
    res.status(200).json({ isPurchased });
  } catch (error) {
    res.status(500).json({ message: "Error checking course purchase status", error });
  }
});
var getCourseDetails2 = (req, res) => __async(void 0, null, function* () {
  var _a, _b;
  try {
    const { courseId } = req.params;
    const userId = (_b = (_a = req.user) == null ? void 0 : _a.id) != null ? _b : null;
    if (!courseId) {
      res.status(400).json({ message: "Course ID is required" });
      return;
    }
    const course = yield useCase.getCourseDetails(courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    const isPurchased = userId ? yield useCase.isCoursePurchased(userId, courseId) : false;
    const responseData = __spreadProps(__spreadValues({}, course), {
      isPurchased
    });
    res.status(200).json({
      data: responseData
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching course details", error });
  }
});
var CoursePurchaseHistory = (req, res) => __async(void 0, null, function* () {
  var _a;
  try {
    const userId = (_a = req.user) == null ? void 0 : _a.id;
    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }
    const courses = yield useCase.getUserPurchasedCourses(userId);
    if (courses.length === 0) {
      res.status(404).json({ message: "No purchase history found" });
      return;
    }
    const purchases = courses.map((course) => ({
      courseId: course._id.toString(),
      // Convert ObjectId to string if necessary
      courseTitle: course.title,
      purchaseDate: (/* @__PURE__ */ new Date()).toISOString(),
      // Replace with actual purchase date if available
      amount: course.fees
      // Assuming fees is the purchase amount
    }));
    res.status(200).json({ data: purchases });
  } catch (error) {
    console.error("Error fetching purchase history:", error);
    res.status(500).json({ message: "Error fetching purchase history", error });
  }
});

// src/interfaces/controllers/user/coursePaymentController.ts
var import_razorpay = __toESM(require("razorpay"));
var import_crypto = __toESM(require("crypto"));
var razorpayInstance = new import_razorpay.default({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || ""
});
var courseRepository = createUserCourseRepository();
var createOrder = (req, res) => __async(void 0, null, function* () {
  var _a, _b;
  const { courseId } = req.body;
  const userId = (_b = (_a = req.user) == null ? void 0 : _a.id) != null ? _b : null;
  if (!courseId || !userId) {
    res.status(400).json({ message: "Course ID and User ID are required!" });
    return;
  }
  try {
    const isPurchased = yield courseRepository.isCoursePurchased(userId, courseId);
    if (isPurchased) {
      res.status(400).json({ message: "You have already purchased this course." });
      return;
    }
    const amount = yield courseRepository.getCourseAmountById(courseId);
    if (amount === null) {
      res.status(404).json({ message: "Course not found or amount is not set!" });
      return;
    }
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: import_crypto.default.randomBytes(10).toString("hex")
    };
    razorpayInstance.orders.create(options, (error, order) => __async(void 0, null, function* () {
      if (error) {
        console.error("Razorpay order creation error:", error);
        res.status(500).json({ message: "Something went wrong while creating the order!" });
        return;
      }
      try {
        yield courseRepository.enrollCourse(userId, courseId, order.id, amount);
        res.status(200).json({ data: order, courseId });
      } catch (dbError) {
        console.error("Database error:", dbError);
        res.status(500).json({ message: "Error saving order to database!" });
      }
    }));
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
});
var verifyOrder = (req, res) => __async(void 0, null, function* () {
  var _a, _b;
  try {
    const { paymentId, orderId, signature, courseId } = req.body;
    const userId = (_b = (_a = req.user) == null ? void 0 : _a.id) != null ? _b : null;
    if (!paymentId || !orderId || !signature) {
      res.status(400).json({ message: "Invalid request data!" });
      return;
    }
    const generatedSignature = import_crypto.default.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "").update(`${orderId}|${paymentId}`).digest("hex");
    if (generatedSignature === signature) {
      yield courseRepository.getEnrollment(userId, orderId, courseId);
      res.status(200).json({ message: "Payment verified successfully!", success: true });
    } else {
      res.status(400).json({ message: "Invalid payment signature!" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
});

// src/interfaces/routes/profileRoutes.ts
var router2 = (0, import_express2.Router)();
router2.get("/", viewProfile2);
router2.put("/", editProfile2);
router2.post("/change-password", changePassword2);
router2.post("/teacher-request", createTeacherRequest2);
router2.get("/teacher-request-status", teacherRequestStatus);
router2.get("/all-courses", getCourses);
router2.get("/user-courses", getUserPurchasedCourses);
router2.get("/course/:courseId/purchased", checkCoursePurchased);
router2.get("/course/:courseId", getCourseDetails2);
router2.get("/coursePurchaseHistory", CoursePurchaseHistory);
router2.post("/payment/orders", createOrder);
router2.post("/payment/verify", verifyOrder);
var profileRoutes_default = router2;

// src/interfaces/routes/teacher/TeacherRoutes.ts
var import_express3 = require("express");
var import_multer = __toESM(require("multer"));

// src/application/use-cases/course/CourseContentUseCase.ts
var createCourseContentUseCase = (repository2) => ({
  getCourseModules: (courseId) => __async(void 0, null, function* () {
    return repository2.getCourseModules(courseId);
  }),
  addModule: (courseId, moduleDetails) => __async(void 0, null, function* () {
    return repository2.addModule(courseId, moduleDetails);
  }),
  updateModule: (moduleId, updatedDetails) => __async(void 0, null, function* () {
    return repository2.updateModule(moduleId, updatedDetails);
  }),
  deleteModule: (moduleId, chapterId, courseId) => __async(void 0, null, function* () {
    return repository2.deleteModule(moduleId, chapterId, courseId);
  }),
  getModuleById: (moduleId) => __async(void 0, null, function* () {
    return repository2.getModuleById(moduleId);
  }),
  deleteContent: (moduleId, contentId) => __async(void 0, null, function* () {
    return repository2.deleteContent(moduleId, contentId);
  })
});

// src/infrastructure/database/models/CourseContent.ts
var import_mongoose6 = __toESM(require("mongoose"));
var ModuleSchema = new import_mongoose6.Schema({
  courseId: { type: import_mongoose6.Schema.Types.ObjectId, ref: "Course", required: true, unique: true },
  modules: [
    {
      title: { type: String, required: true },
      contents: [
        {
          type: { type: String, enum: ["video", "document"], required: true },
          title: { type: String, required: true },
          url: { type: String, required: true },
          // URL for video or document
          duration: { type: Number }
          // Duration in seconds for videos
        }
      ]
    }
  ]
}, { timestamps: true, versionKey: false });
var Module = import_mongoose6.default.model("Module", ModuleSchema);
var CourseContent_default = Module;

// src/application/repositories/CourseContentRepository.ts
var import_mongoose7 = __toESM(require("mongoose"));
var createCourseContentRepository = () => ({
  getCourseModules: (courseId) => __async(void 0, null, function* () {
    const courseIdObj = import_mongoose7.default.Types.ObjectId(courseId);
    return yield CourseContent_default.find({ courseId: courseIdObj });
  }),
  addModule: (courseId, moduleDetails) => __async(void 0, null, function* () {
    const courseIdObj = import_mongoose7.default.Types.ObjectId(courseId);
    const newModule = new CourseContent_default(__spreadProps(__spreadValues({}, moduleDetails), {
      courseId: courseIdObj
    }));
    return yield newModule.save();
  }),
  updateModule: (moduleId, updatedDetails) => __async(void 0, null, function* () {
    const moduleIdObj = import_mongoose7.default.Types.ObjectId(moduleId);
    return yield CourseContent_default.findByIdAndUpdate(
      moduleIdObj,
      { $set: updatedDetails },
      { new: true }
    );
  }),
  deleteModule: (moduleId, chapterId, courseId) => __async(void 0, null, function* () {
    const moduleIdObj = import_mongoose7.default.Types.ObjectId(moduleId);
    const courseIdObj = import_mongoose7.default.Types.ObjectId(courseId);
    const chapterIdObj = import_mongoose7.default.Types.ObjectId(chapterId);
    const module2 = yield CourseContent_default.findOne({ _id: moduleIdObj, courseId: courseIdObj });
    if (!module2) {
      throw new Error("Module not found or does not belong to the given course");
    }
    const result = yield CourseContent_default.updateOne(
      { _id: moduleIdObj, "modules._id": chapterIdObj, courseId: courseIdObj },
      { $pull: { modules: { _id: chapterIdObj } } }
    );
    if (result.nModified === 0) {
      throw new Error("Content not found in the module");
    }
  }),
  getModuleById: (moduleId) => __async(void 0, null, function* () {
    const moduleIdObj = import_mongoose7.default.Types.ObjectId(moduleId);
    return yield CourseContent_default.findById(moduleIdObj);
  }),
  deleteContent: (moduleId, contentId) => __async(void 0, null, function* () {
    const moduleIdObj = import_mongoose7.default.Types.ObjectId(moduleId);
    const contentIdObj = import_mongoose7.default.Types.ObjectId(contentId);
    const result = yield CourseContent_default.updateOne(
      { _id: moduleIdObj, "modules.contents._id": contentIdObj },
      { $pull: { "modules.$.contents": { _id: contentIdObj } } }
    );
    if (result.nModified === 0) {
      throw new Error("Content not found in the module");
    }
  })
});

// src/interfaces/controllers/teacher/CourseContentController.ts
var repository = createCourseContentRepository();
var courseContentUseCase = createCourseContentUseCase(repository);
var getCourseModules = (req, res) => __async(void 0, null, function* () {
  var _a, _b;
  try {
    const course = yield getCourseDetails(req.params.courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    const moduleData = yield courseContentUseCase.getCourseModules(req.params.courseId);
    const responseData = {
      title: course.title,
      courseId: course._id,
      // Assuming 'title' is the property containing the course title
      modules: (_a = moduleData[0]) == null ? void 0 : _a.modules,
      moduleId: (_b = moduleData[0]) == null ? void 0 : _b._id
    };
    res.status(200).json({ data: responseData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
var addModule = (req, res) => __async(void 0, null, function* () {
  try {
    const course = yield getCourseDetails(req.body.courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }
    const moduleDetails = req.body;
    const module2 = yield courseContentUseCase.addModule(req.body.courseId, moduleDetails);
    res.status(201).json({ module: module2 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
var getModuleById = (req, res) => __async(void 0, null, function* () {
  try {
    const module2 = yield courseContentUseCase.getModuleById(req.params.moduleId);
    if (module2) {
      res.status(200).json(module2);
    } else {
      res.status(404).json({ message: "Module not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
var updateModule = (req, res) => __async(void 0, null, function* () {
  try {
    const moduleId = req.params.moduleId;
    const updatedDetails = req.body;
    const module2 = yield courseContentUseCase.getModuleById(moduleId);
    if (!module2) {
      res.status(404).json({ message: "Module not found" });
      return;
    }
    const course = yield getCourseDetails(module2.courseId.toString());
    if (!course) {
      res.status(404).json({ message: "Associated course not found" });
      return;
    }
    const updatedModule = yield courseContentUseCase.updateModule(moduleId, updatedDetails);
    res.status(200).json(updatedModule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
var deleteModule = (req, res) => __async(void 0, null, function* () {
  try {
    const chapterId = req.params.chapterId;
    const { moduleId, courseId } = req.body;
    yield courseContentUseCase.deleteModule(moduleId, chapterId, courseId);
    res.status(200).json({ message: "Module deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
var deleteContent = (req, res) => __async(void 0, null, function* () {
  try {
    const { chapterId, moduleId, contentId, courseId } = req.body;
    const module2 = yield courseContentUseCase.getModuleById(moduleId);
    if (!module2) {
      res.status(404).json({ message: "Module not found" });
      return;
    }
    const course = yield getCourseDetails(courseId);
    if (!course) {
      res.status(404).json({ message: "Associated course not found" });
      return;
    }
    yield courseContentUseCase.deleteContent(moduleId, contentId);
    res.status(200).json({ message: "Content deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
var uploadContent = (req, res) => __async(void 0, null, function* () {
  try {
    const { courseId, moduleId, chapterId } = req.params;
    const file = req.file;
    if (!file) {
      console.error("No file uploaded");
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    const fileStr = file.buffer.toString("base64");
    const uploadResponse = yield cloudinaryConfig_default.uploader.upload(`data:${file.mimetype};base64,${fileStr}`, {
      folder: `courses/${courseId}/modules/${moduleId}/chapters/${chapterId}`,
      resource_type: "auto"
    });
    const publicUrl = uploadResponse.secure_url;
    res.status(200).json({ message: "Content uploaded successfully", url: publicUrl });
  } catch (error) {
    console.error("Error during upload:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// src/interfaces/routes/teacher/TeacherRoutes.ts
var router3 = (0, import_express3.Router)();
var uploadvideo = (0, import_multer.default)({ storage: import_multer.default.memoryStorage() }).single("file");
var upload = (0, import_multer.default)({
  storage: import_multer.default.memoryStorage(),
  limits: { fileSize: 1 * 1024 * 1024 },
  // 1MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
}).single("image");
var uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof import_multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "File size exceeds the 1MB limit" });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};
router3.get("/requests/:id", getTeacherRequestById2);
router3.post("/courses", uploadMiddleware, createCourse2);
router3.put("/courses/:id", uploadMiddleware, updateCourse2);
router3.put("/contents/:id", updateContents);
router3.get("/getCoursesbyTeacher", getCoursesbyTeacher);
router3.get("/getCourseByIdTeacher/:id", getCourse);
router3.delete("/deleteCourse/:id", deleteCourse2);
router3.post("/modules", addModule);
router3.get("/modules/course/:courseId", getCourseModules);
router3.get("/modules/:moduleId", getModuleById);
router3.post("/content/:courseId/modules/:moduleId/chapters/:chapterId/contents", uploadvideo, uploadContent);
router3.put("/modules/:moduleId", updateModule);
router3.delete("/modules/:chapterId", deleteModule);
router3.delete("/content", deleteContent);
var TeacherRoutes_default = router3;

// src/interfaces/middlewares/adminMiddleware.ts
var import_jsonwebtoken3 = __toESM(require("jsonwebtoken"));
var dotenv3 = __toESM(require("dotenv"));
dotenv3.config();
var adminMiddleware = (req, res, next) => {
  var _a;
  const token = (_a = req.header("Authorization")) == null ? void 0 : _a.replace("Bearer ", "");
  if (!token) {
    console.log("no token");
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  try {
    const decoded = import_jsonwebtoken3.default.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    if (decoded.role === "admin") {
      console.log("Access granted. Admin.");
      next();
    } else {
      res.status(403).json({ message: "Access denied. You must be admin." });
    }
  } catch (err) {
    console.log("token not valid");
    res.status(401).json({ message: "Token is not valid", error: err.message });
  }
};

// src/interfaces/routes/admin/adminUserRoutes.ts
var import_express4 = require("express");

// src/interfaces/controllers/admin/adminController.ts
var getUsers = (req, res) => __async(void 0, null, function* () {
  try {
    const users = yield userRepository.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
var blockUser2 = (req, res) => __async(void 0, null, function* () {
  const userId = req.params.id;
  try {
    yield userRepository.blockUser(userId);
    res.status(200).json({ message: "User blocked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
var unblockUser2 = (req, res) => __async(void 0, null, function* () {
  const userId = req.params.id;
  try {
    yield userRepository.unblockUser(userId);
    res.status(200).json({ message: "User unblocked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// src/interfaces/routes/admin/adminUserRoutes.ts
var router4 = (0, import_express4.Router)();
router4.get("/getUsers", getUsers);
router4.put("/block/:id", blockUser2);
router4.put("/unblock/:id", unblockUser2);
router4.get("/teacher-requests", getAllTeacherRequests2);
router4.put("/teacher-requests/:id/status", updateTeacherRequestStatus2);
router4.delete("/teacher-requests/:id", deleteTeacherRequest2);
var adminUserRoutes_default = router4;

// src/interfaces/middlewares/teacherAuthMiddleware.ts
var import_jsonwebtoken4 = __toESM(require("jsonwebtoken"));
var dotenv4 = __toESM(require("dotenv"));
dotenv4.config();
var authAndTeacherMiddleware = (req, res, next) => {
  var _a;
  const token = (_a = req.header("Authorization")) == null ? void 0 : _a.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  try {
    const decoded = import_jsonwebtoken4.default.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    if (decoded.role === "admin" || decoded.role === "teacher") {
      console.log("Access granted. User is a teacher or admin.");
      next();
    } else {
      res.status(403).json({ message: "Access denied. You must be a teacher or admin." });
    }
  } catch (err) {
    res.status(401).json({ message: "Token is not valid", error: err.message });
  }
};

// src/interfaces/middlewares/mockAuthMiddleware.ts
var mockAccessToken = "mockAccessTokenString";
var mockAuthMiddleware = (req, res, next) => {
  if (!req.headers["authorization"]) {
    req.headers["authorization"] = `Bearer ${mockAccessToken}`;
  }
  next();
};

// src/main/app.ts
var import_passport = __toESM(require("passport"));
var cookieParser = require("cookie-parser");
var App = class {
  constructor() {
    this.app = (0, import_express5.default)();
    this.configureMiddleware();
    this.configureRoutes();
    this.setupErrorHandling();
  }
  configureMiddleware() {
    this.app.use((0, import_cors.default)({
      origin: "http://localhost:5173",
      // Add your frontend URL here
      methods: "GET,POST,PUT,DELETE",
      credentials: true
    }));
    this.app.use(cookieParser());
    this.app.use(import_passport.default.initialize());
    this.app.use((0, import_morgan.default)("dev"));
    this.app.use(import_express5.default.json());
  }
  configureRoutes() {
    if (process.env.NODE_ENV === "development") {
      this.app.use(mockAuthMiddleware);
    }
    this.app.use("/api/auth", authenticationRoutes_default);
    this.app.use("/api/profile", authMiddleware, profileRoutes_default);
    this.app.use("/api/teacher", authAndTeacherMiddleware, TeacherRoutes_default);
    this.app.use("/api/admin", adminMiddleware, adminUserRoutes_default);
  }
  setupErrorHandling() {
    this.app.use(errorHandler);
  }
  start(port) {
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
};

// src/main/server.ts
var dotenv5 = __toESM(require("dotenv"));

// src/infrastructure/database/mongoDB.ts
var import_mongoose8 = __toESM(require("mongoose"));
var connectDB = () => __async(void 0, null, function* () {
  try {
    const username = process.env.MONGO_USER;
    const password = process.env.MONGO_PASSWORD;
    const mongoURI = `mongodb://${username}:${password}@localhost:27017/Classroom`;
    const conn = yield import_mongoose8.default.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
      // version warnings
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
});

// src/main/socket.ts
var import_socket = require("socket.io");
function initSocket(server2) {
  const io = new import_socket.Server(server2, {
    cors: {
      origin: "http://localhost:5173",
      // Your frontend URL
      methods: ["GET", "POST"]
    }
  });
  io.on("connection", (socket) => {
    console.log("New Socket.IO connection:", socket.id);
    socket.on("message", (message) => {
      console.log("Received message:", message);
      socket.emit("echo", `Echo: ${message}`);
    });
    socket.on("disconnect", () => {
      console.log("Socket.IO connection closed:", socket.id);
    });
  });
  return io;
}

// src/main/server.ts
var import_http = require("http");
dotenv5.config();
var app = new App();
var PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5e3;
var server = (0, import_http.createServer)(app.app);
initSocket(server);
function startServer() {
  return __async(this, null, function* () {
    try {
      yield redisClient.connect();
      console.log("Connected to Redis");
      yield connectDB();
      console.log("Connected to MongoDB");
      server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  });
}
startServer();
