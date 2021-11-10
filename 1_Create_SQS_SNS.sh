#!/bin/bash

awslocal sqs create-queue --queue-name sqs_queue_scrape
awslocal sqs create-queue --queue-name sqs_queue_notify

