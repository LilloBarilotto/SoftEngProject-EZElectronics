# Test Report

<The goal of this document is to explain how the application was tested, detailing how the test cases were defined and what they cover>

# Contents

- [Test Report](#test-report)
- [Contents](#contents)
- [Dependency graph](#dependency-graph)
- [Integration approach](#integration-approach)
- [Tests](#tests)
- [Coverage](#coverage)
  - [Coverage of FR](#coverage-of-fr)
  - [Coverage white box](#coverage-white-box)

# Dependency graph

     <report the here the dependency graph of EzElectronics>

# Integration approach

    <Write here the integration sequence you adopted, in general terms (top down, bottom up, mixed) and as sequence

    (ex: step1: unit A, step 2: unit A+B, step 3: unit A+B+C, etc)>

    <Some steps may  correspond to unit testing (ex step1 in ex above)>

    <One step will  correspond to API testing, or testing unit route.js>

# Tests

<in the table below list the test cases defined For each test report the object tested, the test level (API, integration, unit) and the technique used to define the test case (BB/ eq partitioning, BB/ boundary, WB/ statement coverage, etc)> <split the table if needed>

| ID  | Test case name | Object(s) tested | Test level | Technique used |
|:----|:------------------:| :--------------: | :--------: | :------------: |
| 1 | should return a 401 response code if user is not authenticated | GET /ezelectronics/reviews/:model | Unit | WB |
| 2 | should return 200 success code | GET /ezelectronics/reviews/:model | Unit | WB |
| 3 | should return a 404 error code if if model does not exists | GET /ezelectronics/reviews/:model | Unit | WB |
| 4 | should return a 401 response code if user is not customer | DELETE ezelectronics/reviews/:model | Unit | WB |
| 5 | should return 200 success code | DELETE ezelectronics/reviews/:model | Unit | WB |
| 6 | should return 404 error code if model does not exists | DELETE ezelectronics/reviews/:model | Unit | WB |
| 7 | should return 404 error code if the current user does not have a review for the product identified by model | DELETE ezelectronics/reviews/:model | Unit | WB |
| 8 | should return a 401 response code if user is not a manage nor an admin | DELETE ezelectronics/reviews | Unit | WB |
| 9 | should return 200 success code | DELETE ezelectronics/reviews | Unit | WB |
| 10 | should return a 401 response code if user is not a customer | POST /ezelectronics/:model | Unit | WB |
| 11 | A validation error should occur | POST /ezelectronics/:model | Unit | WB |
| 12 | should return 200 success code | POST /ezelectronics/:model | Unit | WB |
| 13 | should return a 404 error if model does not exists | POST /ezelectronics/:model | Unit | WB |
| 14 | should return a 409 error if there is an existing review for the product made by the customer | POST /ezelectronics/:model | Unit | WB |
| 15 | should return a 401 response code if user is not a manage nor an admin | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 16 | should return 200 success code | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 17 | should return 404 error code if model does not exist | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 18 | should return a 401 response code if user is not authenticated | GET /ezelectronics/reviews/:model | Unit | WB |
| 19 | should return 200 success code | GET /ezelectronics/reviews/:model | Unit | WB |
| 20 | should return a 404 error code if if model does not exists | GET /ezelectronics/reviews/:model | Unit | WB |
| 21 | should return a 401 response code if user is not customer | DELETE ezelectronics/reviews/:model | Unit | WB |
| 22 | should return 200 success code | DELETE ezelectronics/reviews/:model | Unit | WB |
| 23 | should return 404 error code if model does not exists | DELETE ezelectronics/reviews/:model | Unit | WB |
| 24 | should return 404 error code if the current user does not have a review for the product identified by model | DELETE ezelectronics/reviews/:model | Unit | WB |
| 25 | should return a 401 response code if user is not a manage nor an admin | DELETE ezelectronics/reviews | Unit | WB |
| 26 | should return 200 success code | DELETE ezelectronics/reviews | Unit | WB |
| 27 | should return a 401 response code if user is not a customer | POST /ezelectronics/:model | Unit | WB |
| 28 | A validation error should occur | POST /ezelectronics/:model | Unit | WB |
| 29 | should return 200 success code | POST /ezelectronics/:model | Unit | WB |
| 30 | should return a 404 error if model does not exists | POST /ezelectronics/:model | Unit | WB |
| 31 | should return a 409 error if there is an existing review for the product made by the customer | POST /ezelectronics/:model | Unit | WB |
| 32 | should return a 401 response code if user is not a manage nor an admin | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 33 | should return 200 success code | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 34 | should return 404 error code if model does not exist | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 35 | should return a 401 response code if user is not authenticated | GET /ezelectronics/reviews/:model | Unit | WB |
| 36 | should return 200 success code | GET /ezelectronics/reviews/:model | Unit | WB |
| 37 | should return a 404 error code if if model does not exists | GET /ezelectronics/reviews/:model | Unit | WB |
| 38 | should return a 401 response code if user is not customer | DELETE ezelectronics/reviews/:model | Unit | WB |
| 39 | should return 200 success code | DELETE ezelectronics/reviews/:model | Unit | WB |
| 40 | should return 404 error code if model does not exists | DELETE ezelectronics/reviews/:model | Unit | WB |
| 41 | should return 404 error code if the current user does not have a review for the product identified by model | DELETE ezelectronics/reviews/:model | Unit | WB |
| 42 | should return a 401 response code if user is not a manage nor an admin | DELETE ezelectronics/reviews | Unit | WB |
| 43 | should return 200 success code | DELETE ezelectronics/reviews | Unit | WB |
| 44 | should return a 401 response code if user is not a customer | POST /ezelectronics/:model | Unit | WB |
| 45 | A validation error should occur | POST /ezelectronics/:model | Unit | WB |
| 46 | should return 200 success code | POST /ezelectronics/:model | Unit | WB |
| 47 | should return a 404 error if model does not exists | POST /ezelectronics/:model | Unit | WB |
| 48 | should return a 409 error if there is an existing review for the product made by the customer | POST /ezelectronics/:model | Unit | WB |
| 49 | should return a 401 response code if user is not a manage nor an admin | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 50 | should return 200 success code | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 51 | should return 404 error code if model does not exist | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 52 | should return a 401 response code if user is not authenticated | GET /ezelectronics/reviews/:model | Unit | WB |
| 53 | should return 200 success code | GET /ezelectronics/reviews/:model | Unit | WB |
| 54 | should return a 404 error code if if model does not exists | GET /ezelectronics/reviews/:model | Unit | WB |
| 55 | should return a 401 response code if user is not customer | DELETE ezelectronics/reviews/:model | Unit | WB |
| 56 | should return 200 success code | DELETE ezelectronics/reviews/:model | Unit | WB |
| 57 | should return 404 error code if model does not exists | DELETE ezelectronics/reviews/:model | Unit | WB |
| 58 | should return 404 error code if the current user does not have a review for the product identified by model | DELETE ezelectronics/reviews/:model | Unit | WB |
| 59 | should return a 401 response code if user is not a manage nor an admin | DELETE ezelectronics/reviews | Unit | WB |
| 60 | should return 200 success code | DELETE ezelectronics/reviews | Unit | WB |
| 61 | should return a 401 response code if user is not a customer | POST /ezelectronics/:model | Unit | WB |
| 62 | A validation error should occur | POST /ezelectronics/:model | Unit | WB |
| 63 | should return 200 success code | POST /ezelectronics/:model | Unit | WB |
| 64 | should return a 404 error if model does not exists | POST /ezelectronics/:model | Unit | WB |
| 65 | should return a 409 error if there is an existing review for the product made by the customer | POST /ezelectronics/:model | Unit | WB |
| 66 | should return a 401 response code if user is not a manage nor an admin | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 67 | should return 200 success code | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 68 | should return 404 error code if model does not exist | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 69 | should return a 401 response code if user is not authenticated | GET /ezelectronics/reviews/:model | Unit | WB |
| 70 | should return 200 success code | GET /ezelectronics/reviews/:model | Unit | WB |
| 71 | should return a 404 error code if if model does not exists | GET /ezelectronics/reviews/:model | Unit | WB |
| 72 | should return a 401 response code if user is not customer | DELETE ezelectronics/reviews/:model | Unit | WB |
| 73 | should return 200 success code | DELETE ezelectronics/reviews/:model | Unit | WB |
| 74 | should return 404 error code if model does not exists | DELETE ezelectronics/reviews/:model | Unit | WB |
| 75 | should return 404 error code if the current user does not have a review for the product identified by model | DELETE ezelectronics/reviews/:model | Unit | WB |
| 76 | should return a 401 response code if user is not a manage nor an admin | DELETE ezelectronics/reviews | Unit | WB |
| 77 | should return 200 success code | DELETE ezelectronics/reviews | Unit | WB |
| 78 | should return a 401 response code if user is not a customer | POST /ezelectronics/:model | Unit | WB |
| 79 | A validation error should occur | POST /ezelectronics/:model | Unit | WB |
| 80 | should return 200 success code | POST /ezelectronics/:model | Unit | WB |
| 81 | should return a 404 error if model does not exists | POST /ezelectronics/:model | Unit | WB |
| 82 | should return a 409 error if there is an existing review for the product made by the customer | POST /ezelectronics/:model | Unit | WB |
| 83 | should return a 401 response code if user is not a manage nor an admin | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 84 | should return 200 success code | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 85 | should return 404 error code if model does not exist | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 86 | should return a 401 response code if user is not authenticated | GET /ezelectronics/reviews/:model | Unit | WB |
| 87 | should return 200 success code | GET /ezelectronics/reviews/:model | Unit | WB |
| 88 | should return a 404 error code if if model does not exists | GET /ezelectronics/reviews/:model | Unit | WB |
| 89 | should return a 401 response code if user is not customer | DELETE ezelectronics/reviews/:model | Unit | WB |
| 90 | should return 200 success code | DELETE ezelectronics/reviews/:model | Unit | WB |
| 91 | should return 404 error code if model does not exists | DELETE ezelectronics/reviews/:model | Unit | WB |
| 92 | should return 404 error code if the current user does not have a review for the product identified by model | DELETE ezelectronics/reviews/:model | Unit | WB |
| 93 | should return a 401 response code if user is not a manage nor an admin | DELETE ezelectronics/reviews | Unit | WB |
| 94 | should return 200 success code | DELETE ezelectronics/reviews | Unit | WB |
| 95 | should return a 401 response code if user is not a customer | POST /ezelectronics/:model | Unit | WB |
| 96 | A validation error should occur | POST /ezelectronics/:model | Unit | WB |
| 97 | should return 200 success code | POST /ezelectronics/:model | Unit | WB |
| 98 | should return a 404 error if model does not exists | POST /ezelectronics/:model | Unit | WB |
| 99 | should return a 409 error if there is an existing review for the product made by the customer | POST /ezelectronics/:model | Unit | WB |
| 100 | should return a 401 response code if user is not a manage nor an admin | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 101 | should return 200 success code | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 102 | should return 404 error code if model does not exist | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 103 | should return a 401 response code if user is not authenticated | GET /ezelectronics/reviews/:model | Unit | WB |
| 104 | should return 200 success code | GET /ezelectronics/reviews/:model | Unit | WB |
| 105 | should return a 404 error code if if model does not exists | GET /ezelectronics/reviews/:model | Unit | WB |
| 106 | should return a 401 response code if user is not customer | DELETE ezelectronics/reviews/:model | Unit | WB |
| 107 | should return 200 success code | DELETE ezelectronics/reviews/:model | Unit | WB |
| 108 | should return 404 error code if model does not exists | DELETE ezelectronics/reviews/:model | Unit | WB |
| 109 | should return 404 error code if the current user does not have a review for the product identified by model | DELETE ezelectronics/reviews/:model | Unit | WB |
| 110 | should return a 401 response code if user is not a manage nor an admin | DELETE ezelectronics/reviews | Unit | WB |
| 111 | should return 200 success code | DELETE ezelectronics/reviews | Unit | WB |
| 112 | should return a 401 response code if user is not a customer | POST /ezelectronics/:model | Unit | WB |
| 113 | A validation error should occur | POST /ezelectronics/:model | Unit | WB |
| 114 | should return 200 success code | POST /ezelectronics/:model | Unit | WB |
| 115 | should return a 404 error if model does not exists | POST /ezelectronics/:model | Unit | WB |
| 116 | should return a 409 error if there is an existing review for the product made by the customer | POST /ezelectronics/:model | Unit | WB |
| 117 | should return a 401 response code if user is not a manage nor an admin | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 118 | should return 200 success code | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 119 | should return 404 error code if model does not exist | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 120 | should return a 401 response code if user is not authenticated | GET /ezelectronics/reviews/:model | Unit | WB |
| 121 | should return 200 success code | GET /ezelectronics/reviews/:model | Unit | WB |
| 122 | should return a 404 error code if if model does not exists | GET /ezelectronics/reviews/:model | Unit | WB |
| 123 | should return a 401 response code if user is not customer | DELETE ezelectronics/reviews/:model | Unit | WB |
| 124 | should return 200 success code | DELETE ezelectronics/reviews/:model | Unit | WB |
| 125 | should return 404 error code if model does not exists | DELETE ezelectronics/reviews/:model | Unit | WB |
| 126 | should return 404 error code if the current user does not have a review for the product identified by model | DELETE ezelectronics/reviews/:model | Unit | WB |
| 127 | should return a 401 response code if user is not a manage nor an admin | DELETE ezelectronics/reviews | Unit | WB |
| 128 | should return 200 success code | DELETE ezelectronics/reviews | Unit | WB |
| 129 | should return a 401 response code if user is not a customer | POST /ezelectronics/:model | Unit | WB |
| 130 | A validation error should occur | POST /ezelectronics/:model | Unit | WB |
| 131 | should return 200 success code | POST /ezelectronics/:model | Unit | WB |
| 132 | should return a 404 error if model does not exists | POST /ezelectronics/:model | Unit | WB |
| 133 | should return a 409 error if there is an existing review for the product made by the customer | POST /ezelectronics/:model | Unit | WB |
| 134 | should return a 401 response code if user is not a manage nor an admin | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 135 | should return 200 success code | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 136 | should return 404 error code if model does not exist | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 137 | should return a 401 response code if user is not authenticated | GET /ezelectronics/reviews/:model | Unit | WB |
| 138 | should return 200 success code | GET /ezelectronics/reviews/:model | Unit | WB |
| 139 | should return a 404 error code if if model does not exists | GET /ezelectronics/reviews/:model | Unit | WB |
| 140 | should return a 401 response code if user is not customer | DELETE ezelectronics/reviews/:model | Unit | WB |
| 141 | should return 200 success code | DELETE ezelectronics/reviews/:model | Unit | WB |
| 142 | should return 404 error code if model does not exists | DELETE ezelectronics/reviews/:model | Unit | WB |
| 143 | should return 404 error code if the current user does not have a review for the product identified by model | DELETE ezelectronics/reviews/:model | Unit | WB |
| 144 | should return a 401 response code if user is not a manage nor an admin | DELETE ezelectronics/reviews | Unit | WB |
| 145 | should return 200 success code | DELETE ezelectronics/reviews | Unit | WB |
| 146 | should return a 401 response code if user is not a customer | POST /ezelectronics/:model | Unit | WB |
| 147 | A validation error should occur | POST /ezelectronics/:model | Unit | WB |
| 148 | should return 200 success code | POST /ezelectronics/:model | Unit | WB |
| 149 | should return a 404 error if model does not exists | POST /ezelectronics/:model | Unit | WB |
| 150 | should return a 409 error if there is an existing review for the product made by the customer | POST /ezelectronics/:model | Unit | WB |
| 151 | should return a 401 response code if user is not a manage nor an admin | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 152 | should return 200 success code | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 153 | should return 404 error code if model does not exist | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 154 | should return a 401 response code if user is not authenticated | GET /ezelectronics/reviews/:model | Unit | WB |
| 155 | should return 200 success code | GET /ezelectronics/reviews/:model | Unit | WB |
| 156 | should return a 404 error code if if model does not exists | GET /ezelectronics/reviews/:model | Unit | WB |
| 157 | should return a 401 response code if user is not customer | DELETE ezelectronics/reviews/:model | Unit | WB |
| 158 | should return 200 success code | DELETE ezelectronics/reviews/:model | Unit | WB |
| 159 | should return 404 error code if model does not exists | DELETE ezelectronics/reviews/:model | Unit | WB |
| 160 | should return 404 error code if the current user does not have a review for the product identified by model | DELETE ezelectronics/reviews/:model | Unit | WB |
| 161 | should return a 401 response code if user is not a manage nor an admin | DELETE ezelectronics/reviews | Unit | WB |
| 162 | should return 200 success code | DELETE ezelectronics/reviews | Unit | WB |
| 163 | should return a 401 response code if user is not a customer | POST /ezelectronics/:model | Unit | WB |
| 164 | A validation error should occur | POST /ezelectronics/:model | Unit | WB |
| 165 | should return 200 success code | POST /ezelectronics/:model | Unit | WB |
| 166 | should return a 404 error if model does not exists | POST /ezelectronics/:model | Unit | WB |
| 167 | should return a 409 error if there is an existing review for the product made by the customer | POST /ezelectronics/:model | Unit | WB |
| 168 | should return a 401 response code if user is not a manage nor an admin | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 169 | should return 200 success code | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 170 | should return 404 error code if model does not exist | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 171 | should return a 401 response code if user is not authenticated | GET /ezelectronics/reviews/:model | Unit | WB |
| 172 | should return 200 success code | GET /ezelectronics/reviews/:model | Unit | WB |
| 173 | should return a 404 error code if if model does not exists | GET /ezelectronics/reviews/:model | Unit | WB |
| 174 | should return a 401 response code if user is not customer | DELETE ezelectronics/reviews/:model | Unit | WB |
| 175 | should return 200 success code | DELETE ezelectronics/reviews/:model | Unit | WB |
| 176 | should return 404 error code if model does not exists | DELETE ezelectronics/reviews/:model | Unit | WB |
| 177 | should return 404 error code if the current user does not have a review for the product identified by model | DELETE ezelectronics/reviews/:model | Unit | WB |
| 178 | should return a 401 response code if user is not a manage nor an admin | DELETE ezelectronics/reviews | Unit | WB |
| 179 | should return 200 success code | DELETE ezelectronics/reviews | Unit | WB |
| 180 | should return a 401 response code if user is not a customer | POST /ezelectronics/:model | Unit | WB |
| 181 | A validation error should occur | POST /ezelectronics/:model | Unit | WB |
| 182 | should return 200 success code | POST /ezelectronics/:model | Unit | WB |
| 183 | should return a 404 error if model does not exists | POST /ezelectronics/:model | Unit | WB |
| 184 | should return a 409 error if there is an existing review for the product made by the customer | POST /ezelectronics/:model | Unit | WB |
| 185 | should return a 401 response code if user is not a manage nor an admin | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 186 | should return 200 success code | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 187 | should return 404 error code if model does not exist | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 188 | should return a 401 response code if user is not authenticated | GET /ezelectronics/reviews/:model | Unit | WB |
| 189 | should return 200 success code | GET /ezelectronics/reviews/:model | Unit | WB |
| 190 | should return a 404 error code if if model does not exists | GET /ezelectronics/reviews/:model | Unit | WB |
| 191 | should return a 401 response code if user is not customer | DELETE ezelectronics/reviews/:model | Unit | WB |
| 192 | should return 200 success code | DELETE ezelectronics/reviews/:model | Unit | WB |
| 193 | should return 404 error code if model does not exists | DELETE ezelectronics/reviews/:model | Unit | WB |
| 194 | should return 404 error code if the current user does not have a review for the product identified by model | DELETE ezelectronics/reviews/:model | Unit | WB |
| 195 | should return a 401 response code if user is not a manage nor an admin | DELETE ezelectronics/reviews | Unit | WB |
| 196 | should return 200 success code | DELETE ezelectronics/reviews | Unit | WB |
| 197 | should return a 401 response code if user is not a customer | POST /ezelectronics/:model | Unit | WB |
| 198 | A validation error should occur | POST /ezelectronics/:model | Unit | WB |
| 199 | should return 200 success code | POST /ezelectronics/:model | Unit | WB |
| 200 | should return a 404 error if model does not exists | POST /ezelectronics/:model | Unit | WB |
| 201 | should return a 409 error if there is an existing review for the product made by the customer | POST /ezelectronics/:model | Unit | WB |
| 202 | should return a 401 response code if user is not a manage nor an admin | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 203 | should return 200 success code | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 204 | should return 404 error code if model does not exist | DELETE ezelectronics/reviews/:model/all | Unit | WB |
| 205 | should return a 401 response code if user is not authenticated | GET /ezelectronics/reviews/:model | Integration | BB |
| 206 | should return 200 success code | GET /ezelectronics/reviews/:model | Integration | BB |
| 207 | should return a 404 error code if if model does not exists | GET /ezelectronics/reviews/:model | Integration | BB |
| 208 | should return a 401 response code if user is not customer | DELETE ezelectronics/reviews/:model | Integration | BB |
| 209 | should return 200 success code | DELETE ezelectronics/reviews/:model | Integration | BB |
| 210 | should return 404 error code if model does not exists | DELETE ezelectronics/reviews/:model | Integration | BB |
| 211 | should return 404 error code if the current user does not have a review for the product identified by model | DELETE ezelectronics/reviews/:model | Integration | BB |
| 212 | should return a 401 response code if user is not a manage nor an admin | DELETE ezelectronics/reviews | Integration | BB |
| 213 | should return 200 success code | DELETE ezelectronics/reviews | Integration | BB |
| 214 | should return a 401 response code if user is not a customer | POST /ezelectronics/:model | Integration | BB |
| 215 | A validation error should occur | POST /ezelectronics/:model | Integration | BB |
| 216 | should return 200 success code | POST /ezelectronics/:model | Integration | BB |
| 217 | should return a 404 error if model does not exists | POST /ezelectronics/:model | Integration | BB |
| 218 | should return a 409 error if there is an existing review for the product made by the customer | POST /ezelectronics/:model | Integration | BB |
| 219 | should return a 401 response code if user is not a manage nor an admin | DELETE ezelectronics/reviews/:model/all | Integration | BB |
| 220 | should return 200 success code | DELETE ezelectronics/reviews/:model/all | Integration | BB |
| 221 | should return 404 error code if model does not exist | DELETE ezelectronics/reviews/:model/all | Integration | BB |
| 222 | should return a 401 response code if user is not authenticated | GET /ezelectronics/reviews/:model | Integration | BB |
| 223 | should return 200 success code | GET /ezelectronics/reviews/:model | Integration | BB |
| 224 | should return a 404 error code if if model does not exists | GET /ezelectronics/reviews/:model | Integration | BB |
| 225 | should return a 401 response code if user is not customer | DELETE ezelectronics/reviews/:model | Integration | BB |
| 226 | should return 200 success code | DELETE ezelectronics/reviews/:model | Integration | BB |
| 227 | should return 404 error code if model does not exists | DELETE ezelectronics/reviews/:model | Integration | BB |
| 228 | should return 404 error code if the current user does not have a review for the product identified by model | DELETE ezelectronics/reviews/:model | Integration | BB |
| 229 | should return a 401 response code if user is not a manage nor an admin | DELETE ezelectronics/reviews | Integration | BB |
| 230 | should return 200 success code | DELETE ezelectronics/reviews | Integration | BB |
| 231 | should return a 401 response code if user is not a customer | POST /ezelectronics/:model | Integration | BB |
| 232 | A validation error should occur | POST /ezelectronics/:model | Integration | BB |
| 233 | should return 200 success code | POST /ezelectronics/:model | Integration | BB |
| 234 | should return a 404 error if model does not exists | POST /ezelectronics/:model | Integration | BB |
| 235 | should return a 409 error if there is an existing review for the product made by the customer | POST /ezelectronics/:model | Integration | BB |
| 236 | should return a 401 response code if user is not a manage nor an admin | DELETE ezelectronics/reviews/:model/all | Integration | BB |
| 237 | should return 200 success code | DELETE ezelectronics/reviews/:model/all | Integration | BB |
| 238 | should return 404 error code if model does not exist | DELETE ezelectronics/reviews/:model/all | Integration | BB |
| 239 | should return a 401 response code if user is not authenticated | GET /ezelectronics/reviews/:model | Integration | BB |
| 240 | should return 200 success code | GET /ezelectronics/reviews/:model | Integration | BB |
| 241 | should return a 404 error code if if model does not exists | GET /ezelectronics/reviews/:model | Integration | BB |
| 242 | should return a 401 response code if user is not customer | DELETE ezelectronics/reviews/:model | Integration | BB |
| 243 | should return 200 success code | DELETE ezelectronics/reviews/:model | Integration | BB |
| 244 | should return 404 error code if model does not exists | DELETE ezelectronics/reviews/:model | Integration | BB |
| 245 | should return 404 error code if the current user does not have a review for the product identified by model | DELETE ezelectronics/reviews/:model | Integration | BB |
| 246 | should return a 401 response code if user is not a manage nor an admin | DELETE ezelectronics/reviews | Integration | BB |
| 247 | should return 200 success code | DELETE ezelectronics/reviews | Integration | BB |
| 248 | should return a 401 response code if user is not a customer | POST /ezelectronics/:model | Integration | BB |
| 249 | A validation error should occur | POST /ezelectronics/:model | Integration | BB |
| 250 | should return 200 success code | POST /ezelectronics/:model | Integration | BB |
| 251 | should return a 404 error if model does not exists | POST /ezelectronics/:model | Integration | BB |
| 252 | should return a 409 error if there is an existing review for the product made by the customer | POST /ezelectronics/:model | Integration | BB |
| 253 | should return a 401 response code if user is not a manage nor an admin | DELETE ezelectronics/reviews/:model/all | Integration | BB |
| 254 | should return 200 success code | DELETE ezelectronics/reviews/:model/all | Integration | BB |
| 255 | should return 404 error code if model does not exist | DELETE ezelectronics/reviews/:model/all | Integration | BB |
| 256 | should return a 401 response code if user is not authenticated | GET /ezelectronics/reviews/:model | Integration | BB |
| 257 | should return 200 success code | GET /ezelectronics/reviews/:model | Integration | BB |
| 258 | should return a 404 error code if if model does not exists | GET /ezelectronics/reviews/:model | Integration | BB |
| 259 | should return a 401 response code if user is not customer | DELETE ezelectronics/reviews/:model | Integration | BB |
| 260 | should return 200 success code | DELETE ezelectronics/reviews/:model | Integration | BB |
| 261 | should return 404 error code if model does not exists | DELETE ezelectronics/reviews/:model | Integration | BB |
| 262 | should return 404 error code if the current user does not have a review for the product identified by model | DELETE ezelectronics/reviews/:model | Integration | BB |
| 263 | should return a 401 response code if user is not a manage nor an admin | DELETE ezelectronics/reviews | Integration | BB |
| 264 | should return 200 success code | DELETE ezelectronics/reviews | Integration | BB |
| 265 | should return a 401 response code if user is not a customer | POST /ezelectronics/:model | Integration | BB |
| 266 | A validation error should occur | POST /ezelectronics/:model | Integration | BB |
| 267 | should return 200 success code | POST /ezelectronics/:model | Integration | BB |
| 268 | should return a 404 error if model does not exists | POST /ezelectronics/:model | Integration | BB |
| 269 | should return a 409 error if there is an existing review for the product made by the customer | POST /ezelectronics/:model | Integration | BB |
| 270 | should return a 401 response code if user is not a manage nor an admin | DELETE ezelectronics/reviews/:model/all | Integration | BB |
| 271 | should return 200 success code | DELETE ezelectronics/reviews/:model/all | Integration | BB |
| 272 | should return 404 error code if model does not exist | DELETE ezelectronics/reviews/:model/all | Integration | BB |
| 273 | should return a 401 response code if user is not authenticated | GET /ezelectronics/reviews/:model | Integration | BB |
| 274 | should return 200 success code | GET /ezelectronics/reviews/:model | Integration | BB |
| 275 | should return a 404 error code if if model does not exists | GET /ezelectronics/reviews/:model | Integration | BB |
| 276 | should return a 401 response code if user is not customer | DELETE ezelectronics/reviews/:model | Integration | BB |
| 277 | should return 200 success code | DELETE ezelectronics/reviews/:model | Integration | BB |
| 278 | should return 404 error code if model does not exists | DELETE ezelectronics/reviews/:model | Integration | BB |
| 279 | should return 404 error code if the current user does not have a review for the product identified by model | DELETE ezelectronics/reviews/:model | Integration | BB |
| 280 | should return a 401 response code if user is not a manage nor an admin | DELETE ezelectronics/reviews | Integration | BB |
| 281 | should return 200 success code | DELETE ezelectronics/reviews | Integration | BB |
| 282 | should return a 401 response code if user is not a customer | POST /ezelectronics/:model | Integration | BB |
| 283 | A validation error should occur | POST /ezelectronics/:model | Integration | BB |
| 284 | should return 200 success code | POST /ezelectronics/:model | Integration | BB |
| 285 | should return a 404 error if model does not exists | POST /ezelectronics/:model | Integration | BB |
| 286 | should return a 409 error if there is an existing review for the product made by the customer | POST /ezelectronics/:model | Integration | BB |
| 287 | should return a 401 response code if user is not a manage nor an admin | DELETE ezelectronics/reviews/:model/all | Integration | BB |
| 288 | should return 200 success code | DELETE ezelectronics/reviews/:model/all | Integration | BB |
| 289 | should return 404 error code if model does not exist | DELETE ezelectronics/reviews/:model/all | Integration | BB |

# Coverage

## Coverage of FR

<Report in the following table the coverage of functional requirements and scenarios(from official requirements) >

| Functional Requirement or scenario | Test(s) |
| :--------------------------------: | :-----: |
|                FRx                 |         |
|                FRy                 |         |
|                ...                 |         |

## Coverage white box

Report here the screenshot of coverage values obtained with jest-- coverage
