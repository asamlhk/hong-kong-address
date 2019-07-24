import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as _ from 'lodash';
import { MatAutocompleteSelectedEvent } from '@angular/material';

/**
 * @title Simple autocomplete
 */
@Component({
  selector: 'autocomplete-simple-example',
  templateUrl: 'autocomplete-simple-example.html',
  styleUrls: ['autocomplete-simple-example.css'],
})
export class AutocompleteSimpleExample {
  myControl = new FormControl();

  filteredoptions = [];
  search = '';
  option;
  address1;
  address2;
  address3;

  searchChanged = _.debounce(() => {
    this.fetchData(this.search)
  }, 1000
  );

  setValue(event: MatAutocompleteSelectedEvent) {
    const key = event.option.value;
    this.option = this.filteredoptions.filter(
      x => x.key == key
    )[0].value;

    const EN = this.option.EngPremisesAddress;
    const CH = this.option.ChiPremisesAddress

    this.address1 = EN.EngStreet.BuildingNoFrom + ' ' + EN.EngStreet.StreetName;
    this.address2 = EN.EngDistrict.DcDistrict;
    this.address3 = EN.Region;
  }
  fetchData(s) { // without type info    

    if (s == "") return
    fetch(`https://www.als.ogcio.gov.hk/lookup?q=${s}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then(r => r.json())
      .then(
        r => this.filteredoptions = this.update(r)
      )
  }

  update = (r) => {
    return r.SuggestedAddress.map(
      a => {
        const eng = a.Address.PremisesAddress.EngPremisesAddress;
        const chi = a.Address.PremisesAddress.ChiPremisesAddress;

        const view =
        {
          'BuildingName': eng.BuildingName ? eng.BuildingName : '',
          'Estate': eng.EngEstate ? eng.EngEstate.EstateName : '',
          'Block': eng.EngBlock ? `${eng.EngBlock.BlockDescriptor} ${eng.EngBlock.BlockNo}` : '',
          'Street': eng.EngStreet ? `${eng.EngStreet.BuildingNoFrom} ${eng.EngStreet.StreetName}` : '',
          'BuildingNameZH': chi.BuildingName ? chi.BuildingName : '',
          'EstateZH': chi.ChiEstate ? chi.ChiEstate.EstateName : '',
          'BlockZH': chi.ChiBlock ? `${chi.ChiBlock.BlockNo} ${chi.ChiBlock.BlockDescriptor} ` : '',
          'StreetZH': chi.ChiStreet ? `${chi.ChiStreet.BuildingNoFrom} ${chi.ChiStreet.StreetName}` : '',
        }

        return {
          key: `${view.BuildingName} ${view.Estate} ${view.Block} - ${view.EstateZH}${view.BuildingNameZH} ${view.BlockZH}`,
          value: a.Address.PremisesAddress
        }

      }
    )
  }
}


/**  Copyright 2019 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */