package com.techelevator.dao;

import com.techelevator.model.Passport;
import com.techelevator.model.PassportBeerInfo;
import com.techelevator.model.PassportBreweryInfo;

import java.util.List;

public interface PassportDao {

    List<Passport> getPassport(int userID);
    List<Passport> getPassportBeer(int userID);
    List<Passport> getPassportBrewery(int userID);
    List<PassportBeerInfo> getPassportBeerInfo(int userId, int breweryId);
    List<PassportBreweryInfo> getPassportBreweryInfo(int userId);
}