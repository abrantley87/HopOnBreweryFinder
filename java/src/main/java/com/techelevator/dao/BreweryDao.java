package com.techelevator.dao;

import com.techelevator.model.Brewery;

import java.util.List;

public interface BreweryDao {

 List<Brewery> getAllBrewery();

 Brewery getBreweryById(int id);


}
