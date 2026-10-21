import type {SequenceDefinition} from '../../components/reader/presentation-contract.js';
import {numberSequences} from './numbers.js';
import {physicsSequences} from './physics.js';

export const sequences:readonly SequenceDefinition[]=[...numberSequences,...physicsSequences];
