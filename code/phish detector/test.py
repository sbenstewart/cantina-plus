import joblib
import features_extraction
import sys
import numpy as np
import json
import sys
import os
import subprocess

from features_extraction import LOCALHOST_PATH, DIRECTORY_NAME

@profile
def get_prediction_from_url(test_url):
    features_test = features_extraction.main(test_url)
    features_test = np.array(features_test).reshape((1, -1))

    clf = joblib.load(LOCALHOST_PATH + DIRECTORY_NAME + '/classifier/random_forest.pkl')

    pred = clf.predict(features_test)
    return int(pred[0])


def main():
    url = sys.argv[1]

    white_list_file = open('/Users/benstewart/BEN STUFF/PROJECTS/fyp/code/phish detector/whitelist.txt').read()
    white_list = white_list_file.split('\n')
    if url in white_list:
        print("SAFE")
    else:
        prediction = get_prediction_from_url(url)

        # Print the probability of prediction (if needed)
        # prob = clf.predict_proba(features_test)
        # print 'Features=', features_test, 'The predicted probability is - ', prob, 'The predicted label is - ', pred
        #    print "The probability of this site being a phishing website is ", features_test[0]*100, "%"

        if prediction == 1:
            # print "The website is safe to browse"
            print("SAFE")
            white_list_file=open('/Users/benstewart/BEN STUFF/PROJECTS/fyp/code/phish detector/whitelist.txt', "a+")
            white_list_file.write(url)
            white_list_file.write("\n")
            white_list_file.close()

        elif prediction == -1:
            # print "The website has phishing features. DO NOT VISIT!"
            print("PHISHING")
            # load into the whole list for target identifier
            json_path = '/Users/benstewart/BEN STUFF/PROJECTS/fyp/code/target identifier/sites.json'
            with open(json_path, 'r') as json_file:
                results = json.load(json_file)
                #print(results)

            with open(json_path) as json_file:
                json_decoded = json.load(json_file)

            json_decoded['url'] = url

            with open(json_path, 'w') as json_file:
                json.dump(json_decoded, json_file, sort_keys=True, indent=4, separators=(',', ': ')) 

             
            #only single url to be scraped
            single_json_decoded = {}
            json_path = '/Users/benstewart/BEN STUFF/PROJECTS/fyp/code/target identifier/single-sites.json'
            single_json_decoded['url'] = url
            with open(json_path, 'w') as json_file:
                json.dump(single_json_decoded, json_file, sort_keys=True, indent=4, separators=(',', ': '))    



if __name__ == "__main__":
    main()
