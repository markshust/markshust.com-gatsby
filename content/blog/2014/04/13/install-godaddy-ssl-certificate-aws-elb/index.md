---
title: "Install a GoDaddy SSL Certificate into AWS ELB"
date: "2014-04-13T22:03:00.000Z"
tags: ["aws", "elb", "ssl"]
---

Amazon Web Services (AWS) Elastic Load Balancing (ELB) is a great service that allows you to scale your AWS-based servers very easily. However, setting up SSL within an ELB is a bit tricky if you've never done it before. You can use just about any computer to do this, but if you have a web server with OpenSSL and some command line experience, that will make things easy.

## Generate a Private Key and Certificate Signing Request (CSR)

Your first step is to generate a private key, and then a CSR from that key. Keep this key private at all times, as it is used in tandom with your public key to decode secure data.

```meta
mkdir ~/ssl
cd ~/ssl
openssl req -new -newkey rsa:2048 -nodes -keyout private.pem -out csr.pem
```

You'll be asked for some info to generate the CSR. Here is some sample data to follow to help you out with what goes where.

- **Country Name:** Two-letter ISO country abbreviation. *Example: US*
- **State or Province Name:** Full name of the state where the organization is located. *Example: Ohio*
- **Locality Name:** Full name of the city where the organization is located. *Example: Cleveland*
- **Organization Name:** Full name of the organization. *Example: Acme LLC*
- **Organizational Unit Name:** Optional, division of company. *Example: Headquarters*
- **Common Name:** The fully qualified domain name (matching exactly). Wildcard's use an asterisk. *Example: www.domain.com or *.domain.com (wildcard)*
- **Email Address:** The server administrator's email address. *Example: someone@domain.com*

**Important Note:** Do not set a 'Challenge Password' as these are not compatible (nor desired) with AWS ELB.

## Generate and Download SSL Certificate and Chain

Now that you have your CSR, go to GoDaddy and generate your certificate. Go ahead and download it (select Other when asked about web server). I've noticed that GoDaddy already provides you the certificate and chain file in PEM format, albeit with .crt extensions, so no conversions are needed. Copy your certificate to `~/ssl/public.pem`, and the the chain file (`gd_bundle-g2-g1.crt`) file to `~/ssl/`.

## Upload Your Certificate to AWS

ELB has a web-based interface where you can copy and paste the contents of the files into the form when assigning an SSL Certificate under the Listeners tab. Make sure to also upload GoDaddy's `gd_bundle-g2-g1.crt` file (the one that came with your downloaded cert) into the "Chain File" section.

If you want to use the AWS command line tools to install the SSL cert, run this line after configuring the AWS account on your computer, replacing www.domain.com with the name you want to use for your cert file:

```meta
aws iam upload-server-certificate --server-certificate-name www.domain.com --certificate-body file://public.pem --private-key file://private.pem --certificate-chain file://gd_bundle-g2-g1.crt
```

After submitting the form or running this command line, your secure certificate should now show up in the ELB control panel listener tab!
