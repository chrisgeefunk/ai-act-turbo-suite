# sample terraform fly setup placeholder
terraform {
  required_version = ">=1.5.0"
}

provider "fly" {
  # config via env vars
}

resource "fly_app" "assessment" {
  name = "assessment-api"
  org  = "personal"
}
