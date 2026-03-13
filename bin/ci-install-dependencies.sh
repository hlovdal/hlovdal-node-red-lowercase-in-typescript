#!/bin/bash

set -euo pipefail

if ! command -v npm
then
	dnf install -y nodejs nodejs-npm
fi
if ! command -v ps
then
	dnf install -y procps-ng
fi

# Cypress dependencies. Command to get package names:
# ldd $HOME/.cache/Cypress/15.11.0/Cypress/Cypress | awk '{print "/usr/lib64/" $1}' | xargs rpm -qf | sed 's/-[0-9].*//' | sort -u | xargs
# In addition, ps above is also a Cypress dependency.

dnf install -y xorg-x11-server-Xvfb alsa-lib at-spi2-atk at-spi2-core atk avahi-libs bzip2-libs cairo cairo-gobject cups-libs dbus-libs expat fontconfig freetype fribidi gdk-pixbuf2 glib2 glibc glycin-libs gmp gnutls graphite2 gtk3 harfbuzz json-glib keyutils-libs krb5-libs lcms2 libX11 libXau libXcomposite libXcursor libXdamage libXext libXfixes libXi libXinerama libXrandr libXrender libblkid libbrotli libcap libcloudproviders libcom_err libdatrie libdrm libepoxy libffi libgcc libidn2 libmount libpng libseccomp libselinux libtasn1 libthai libtinysparql libunistring libwayland-client libwayland-cursor libwayland-egl libxcb libxkbcommon libxml2 mesa-libgbm nettle nspr nss nss-util openssl-libs p11-kit pango pcre2 pixman sqlite-libs systemd-libs xz-libs zlib-ng-compat
