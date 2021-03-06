/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * =============================================================================
 */

import {ChainedStream} from './data_stream';
import {streamFromItems} from './data_stream';
import {TestIntegerStream} from './data_stream_test';

describe('ChainedStream', () => {
  // TODO(davidsoergel): Remove this once we figure out the timeout issue.
  let originalTimeout: number;
  beforeAll(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
  });
  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  it('produces a single underlying stream as expected', done => {
    const chainedStreamPromise =
        ChainedStream.create(streamFromItems([new TestIntegerStream()]));

    const expectedResult: number[] = [];
    for (let i = 0; i < 1; i++) {
      for (let j = 0; j < 100; j++) {
        expectedResult[i * 100 + j] = j;
      }
    }

    chainedStreamPromise
        .then(chainedStream => chainedStream.collectRemaining().then(result => {
          expect(result).toEqual(expectedResult);
        }))
        .then(done)
        .catch(done.fail);
  });
  it('produces multiple underlying streams as expected', done => {
    const chainedStreamPromise = ChainedStream.create(streamFromItems([
      new TestIntegerStream(), new TestIntegerStream(), new TestIntegerStream(),
      new TestIntegerStream()
    ]));

    const expectedResult: number[] = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 100; j++) {
        expectedResult[i * 100 + j] = j;
      }
    }

    chainedStreamPromise
        .then(chainedStream => chainedStream.collectRemaining().then(result => {
          expect(result).toEqual(expectedResult);
        }))
        .then(done)
        .catch(done.fail);
  });
});
