// This file is part of Invenio.
//
// Copyright (C) 2021-2022 Graz University of Technology.
//
// React-Records-Marc21 is free software; you can redistribute it and/or
// modify it under the terms of the MIT License; see LICENSE file for more
// details.

import { combineReducers } from "redux";

import depositReducer from "./deposit";
export default combineReducers({
  deposit: depositReducer,
});
