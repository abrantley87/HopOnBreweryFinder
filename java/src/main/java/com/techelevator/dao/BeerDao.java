package com.techelevator.dao;

import com.techelevator.model.Beer;

public interface BeerDao {

    Beer getAllBeersByBrewery(int breweryId);


}
