#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import {Stack} from '../lib/stack';

const app = new cdk.App();
new Stack(app, 'SpideyCrimeTrackerStack', {
    stackName: "SpideyCrimeTrackerStack",
    env: {account: '363615071302', region: 'eu-west-1'},
    tags: {
        "owner": "avishkarm@bbd.co.za",
        "created-using": "cdk",
    },
    repositoryConfig: [
        {owner: 'WebLevelUp', repo: 'SpideyCrimeTracker'}
    ]
});
